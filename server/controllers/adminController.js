// server/controllers/adminController.js

const Order = require('../models/Order');
const Service = require('../models/Service');
const File = require('../models/File');
const User = require('../models/User');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');
const { sendStatusUpdateNotification, sendFileUploadNotification } = require('../utils/notifications');

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private/Admin
exports.getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 10, search } = req.query;

    // Build query
    const query = {};

    // Status filter
    if (status && status !== 'all') {
      query.status = status;
    }

    // ✅ Search filter
    if (search) {
      const searchRegex = new RegExp(search, 'i');

      // Find matching clients
      const matchingClients = await User.find({
        $or: [{ name: searchRegex }, { email: searchRegex }],
      }).select('_id');

      const clientIds = matchingClients.map((c) => c._id);

      query.$or = [
        { orderNumber: searchRegex },
        { client: { $in: clientIds } },
      ];
    }

    const total = await Order.countDocuments(query);
    const totalPages = Math.ceil(total / parseInt(limit));
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const orders = await Order.find(query)
      .populate('client', 'name email phone country visitPurpose')
      .populate('service', 'name tagline price currency')
      .populate('files') // ✅ populate File refs
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: orders,
      totalPages,
      currentPage: parseInt(page),
      total,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('client', 'name email phone country visitPurpose')
      .populate('service', 'name tagline price currency')
      .populate('files')
      .populate('statusHistory.updatedBy', 'name');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Clients can only see their own orders
    if (
      req.user.role !== 'admin' &&
      order.client._id.toString() !== req.user.id
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order status
// @route   PATCH /api/admin/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }

    const validStatuses = ['pending', 'in_progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const order = await Order.findById(req.params.id)
      .populate('client', 'name email phone');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.status = status;
    order.statusHistory.push({
      status,
      note: note || `Status updated to ${status}`,
      updatedBy: req.user.id,
      timestamp: new Date(),
    });

    await order.save();

    // Send notification (don't fail if notification fails)
    try {
      await sendStatusUpdateNotification(order, status, note);
    } catch (notifError) {
      console.error('Notification error:', notifError.message);
    }

    const updatedOrder = await Order.findById(req.params.id)
      .populate('client', 'name email phone')
      .populate('service', 'name')
      .populate('files');

    res.json({ success: true, data: updatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete order
// @route   DELETE /api/admin/orders/:id
// @access  Private/Admin
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // ✅ Delete associated files from Cloudinary
    if (order.files && order.files.length > 0) {
      const files = await File.find({ _id: { $in: order.files } });
      for (const file of files) {
        if (file.publicId) {
          try {
            await cloudinary.uploader.destroy(file.publicId);
          } catch (cloudErr) {
            console.error('Cloudinary delete error:', cloudErr.message);
          }
        }
      }
      await File.deleteMany({ _id: { $in: order.files } });
    }

    await Order.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Upload files to order
// @route   POST /api/admin/orders/:id/files
// @access  Private/Admin
exports.uploadFiles = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('client', 'name email phone');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    const uploadPromises = req.files.map((file) => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: `ikaze/orders/${order.orderNumber}`,
            resource_type: 'auto',
          },
          async (error, result) => {
            if (error) return reject(error);

            const fileDoc = await File.create({
              order: order._id,
              fileName: file.originalname,
              fileType: req.body.fileType || 'document',
              fileUrl: result.secure_url,
              publicId: result.public_id,
              fileSize: result.bytes,
              mimeType: file.mimetype,
              uploadedBy: req.user.id,
              description: req.body.description || '',
            });

            order.files.push(fileDoc._id);
            resolve(fileDoc);
          }
        );
        streamifier.createReadStream(file.buffer).pipe(uploadStream);
      });
    });

    const uploadedFiles = await Promise.all(uploadPromises);
    await order.save();

    // Send notification
    try {
      await sendFileUploadNotification(order, uploadedFiles);
    } catch (notifError) {
      console.error('Notification error:', notifError.message);
    }

    res.json({
      success: true,
      message: `${uploadedFiles.length} file(s) uploaded successfully`,
      data: uploadedFiles,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get analytics/stats
// @route   GET /api/admin/analytics
// @access  Private/Admin
exports.getAnalytics = async (req, res) => {
  try {
    const [
      totalOrders,
      pendingOrders,
      inProgressOrders,
      completedOrders,
      cancelledOrders,
      totalClients,
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ status: 'pending' }),
      Order.countDocuments({ status: 'in_progress' }),
      Order.countDocuments({ status: 'completed' }),
      Order.countDocuments({ status: 'cancelled' }),
      User.countDocuments({ role: 'client' }),
    ]);

    const revenueResult = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    const recentOrders = await Order.find()
      .populate('client', 'name email')
      .populate('service', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        stats: {
          totalOrders,
          pendingOrders,
          inProgressOrders,
          completedOrders,
          cancelledOrders,
          totalRevenue: revenueResult[0]?.total || 0,
          totalClients,
        },
        recentOrders,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create service
// @route   POST /api/admin/services
// @access  Private/Admin
exports.createService = async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update service
// @route   PUT /api/admin/services/:id
// @access  Private/Admin
exports.updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    res.json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete service
// @route   DELETE /api/admin/services/:id
// @access  Private/Admin
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    res.json({ success: true, message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, role } = req.query;
    const query = {};

    if (role && role !== 'all') query.role = role;

    if (search) {
      const r = new RegExp(search, 'i');
      query.$or = [{ name: r }, { email: r }, { phone: r }, { country: r }];
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((+page - 1) * +limit)
      .limit(+limit);

    const orderCounts = await Order.aggregate([
      { $group: { _id: '$client', count: { $sum: 1 } } },
    ]);
    const countMap = Object.fromEntries(
      orderCounts.map(o => [o._id.toString(), o.count])
    );
    const usersWithOrders = users.map(u => ({
      ...u.toObject(),
      orderCount: countMap[u._id.toString()] || 0,
    }));

    res.json({
      success: true,
      data: usersWithOrders,
      total,
      totalPages: Math.ceil(total / +limit),
      currentPage: +page,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle user active status
// @route   PATCH /api/admin/users/:id/toggle
// @access  Private/Admin
exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};