// server/routes/services.js

const express = require('express');
const router = express.Router();
const {
  getServices,
  getAllServices,
  getServiceById,
} = require('../controllers/serviceController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');

// Public routes
router.get('/', getServices);                    // GET /api/services (active only)
router.get('/all', protect, adminOnly, getAllServices); // GET /api/services/all (admin)
router.get('/:id', getServiceById);              // GET /api/services/:id

module.exports = router;