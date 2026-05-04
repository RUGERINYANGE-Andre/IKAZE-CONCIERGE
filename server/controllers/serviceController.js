// server/controllers/serviceController.js

const Service = require('../models/Service');

// @desc    Get all active services (public)
// @route   GET /api/services
// @access  Public
exports.getServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ createdAt: 1 });
    res.json({ success: true, data: services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all services including inactive (admin)
// @route   GET /api/services/all
// @access  Private/Admin
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: 1 });
    res.json({ success: true, data: services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single service
// @route   GET /api/services/:id
// @access  Public
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    res.json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create service
// @route   POST /api/admin/services
// @access  Private/Admin
exports.createService = async (req, res) => {
  try {
    const { serviceId, name, tagline, description, price, currency, features, icon, popular, isActive } = req.body;

    if (!serviceId || !name || !tagline || !price) {
      return res.status(400).json({
        success: false,
        message: 'serviceId, name, tagline and price are required',
      });
    }

    // Check if serviceId already exists
    const exists = await Service.findOne({ serviceId });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: 'A service with this ID already exists',
      });
    }

    const service = await Service.create({
      serviceId,
      name,
      tagline,
      description,
      price: parseFloat(price),
      currency: currency || 'USD',
      features: features || [],
      icon: icon || '📋',
      popular: popular || false,
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json({ success: true, data: service });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update service
// @route   PUT /api/admin/services/:id
// @access  Private/Admin
exports.updateService = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // Ensure price is a number
    if (updateData.price) {
      updateData.price = parseFloat(updateData.price);
    }

    // Filter empty features
    if (updateData.features) {
      updateData.features = updateData.features.filter((f) => f.trim());
    }

    const service = await Service.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    res.json({ success: true, data: service });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
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

// @desc    Toggle service active status
// @route   PATCH /api/admin/services/:id/toggle
// @access  Private/Admin
exports.toggleServiceStatus = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    service.isActive = !service.isActive;
    await service.save();
    res.json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};