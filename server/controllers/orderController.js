// server/controllers/orderController.js

const mongoose = require('mongoose');
const Order   = require('../models/Order');
const Service = require('../models/Service');
const User    = require('../models/User');
const { sendAllNotifications } = require('../utils/notifications');

// @desc    Create new order
// @route   POST /api/orders
// @access  Public (no auth required — guests can book)
exports.createOrder = async (req, res) => {
  try {
    const { clientData, serviceId, visitDetails } = req.body;

    // ── Validate required fields ────────────────────────────────────────────
    if (!clientData || !serviceId || !visitDetails) {
      return res.status(400).json({
        success: false,
        message: 'clientData, serviceId, and visitDetails are required',
      });
    }

    if (!clientData.email || !clientData.name || !clientData.phone) {
      return res.status(400).json({
        success: false,
        message: 'clientData must include name, email, and phone',
      });
    }

    if (!visitDetails.arrivalDate) {
      return res.status(400).json({
        success: false,
        message: 'visitDetails.arrivalDate is required',
      });
    }

    // ── Resolve service ─────────────────────────────────────────────────────
    // Support both a real MongoDB ObjectId and the human-readable serviceId
    // string (e.g. 'a', 'b', 'essential-entry') so the booking works whether
    // the frontend is showing DB services or static fallback cards.
    let service = null;

    if (mongoose.isValidObjectId(serviceId)) {
      service = await Service.findById(serviceId);
    }

    // If not found by _id, try the serviceId string field on the Service model
    if (!service) {
      service = await Service.findOne({ serviceId });
    }

    // Last resort: match by name (covers cases where static card name === DB name)
    if (!service) {
      service = await Service.findOne({
        name: { $regex: new RegExp(`^${serviceId}$`, 'i') },
      });
    }

    if (!service) {
      return res.status(404).json({
        success: false,
        message: `Service not found for id: "${serviceId}". Please refresh and try again.`,
      });
    }

    if (!service.isActive) {
      return res.status(400).json({
        success: false,
        message: 'This service is currently unavailable',
      });
    }

    // ── Find or create client user ──────────────────────────────────────────
    const emailNormalised = clientData.email.toLowerCase().trim();
    let client = await User.findOne({ email: emailNormalised });

    if (!client) {
      // Build the user document; omit password so the model default applies.
      // If your User model has `password: { required: true }` you must make it
      // optional — but we are not touching the model here, so we set a
      // placeholder that is never used for login.
      const userData = {
        name:         clientData.name.trim(),
        email:        emailNormalised,
        phone:        clientData.phone.trim(),
        country:      clientData.country  || '',
        visitPurpose: clientData.visitPurpose || '',
        role:         'client',
      };

      // Only set password if the model requires it; use a random unguessable
      // value — the client can reset via email later if they want dashboard access.
      try {
        client = await User.create(userData);
      } catch (userErr) {
        // If password is required by the model, create with a locked placeholder
        if (userErr.name === 'ValidationError' && userErr.errors?.password) {
          const crypto = require('crypto');
          userData.password = crypto.randomBytes(32).toString('hex');
          client = await User.create(userData);
        } else {
          throw userErr;
        }
      }
    } else {
      // Update fields for returning client
      client.name         = clientData.name         || client.name;
      client.phone        = clientData.phone         || client.phone;
      client.country      = clientData.country       || client.country;
      client.visitPurpose = clientData.visitPurpose  || client.visitPurpose;
      await client.save();
    }

    // ── Create order ────────────────────────────────────────────────────────
    // Do NOT pass statusHistory — the pre('save') hook in Order.js handles it.
    const order = await Order.create({
      client:  client._id,
      service: service._id,
      serviceSnapshot: {
        name:     service.name,
        price:    service.price,
        currency: service.currency || 'USD',
      },
      visitDetails: {
        arrivalDate:    new Date(visitDetails.arrivalDate),
        departureDate:  visitDetails.departureDate ? new Date(visitDetails.departureDate) : undefined,
        numberOfPeople: Number(visitDetails.numberOfPeople) || 1,
        specialRequests: visitDetails.specialRequests || '',
      },
      totalAmount: service.price,
    });

    // Populate for response + notifications
    await order.populate('client service');

    // ── Send notifications (non-blocking) ───────────────────────────────────
    let notificationResults = {
      whatsapp: { success: false },
      email:    { success: false },
    };
    try {
      notificationResults = await sendAllNotifications(order);
      await Order.findByIdAndUpdate(order._id, {
        'notificationsSent.whatsapp': notificationResults.whatsapp.success,
        'notificationsSent.email':    notificationResults.email.success,
      });
    } catch (notifError) {
      console.error('Notification error (non-fatal):', notifError.message);
    }

    return res.status(201).json({
      success: true,
      data:    order,
      message: 'Order created successfully! Check your email and WhatsApp for confirmation.',
      notifications: notificationResults,
    });
  } catch (error) {
    console.error('CREATE ORDER ERROR:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get my orders
// @route   GET /api/orders/my-orders
// @access  Private
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ client: req.user.id })
      .populate('service')
      .populate('files')
      .sort('-createdAt');

    return res.json({ success: true, data: orders });
  } catch (error) {
    console.error('GET MY ORDERS ERROR:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('client', '-password')
      .populate('service')
      .populate('files');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Check ownership or admin
    if (
      order.client._id.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    return res.json({ success: true, data: order });
  } catch (error) {
    console.error('GET ORDER BY ID ERROR:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};