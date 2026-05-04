// server/routes/orders.js

const express = require('express');
const router  = express.Router();

const { createOrder, getMyOrders, getOrderById } = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

// POST /api/orders — public, no token required (guests can book)
router.post('/', createOrder);

// GET /api/orders/my-orders — private, must be logged in
router.get('/my-orders', protect, getMyOrders);

// GET /api/orders/:id — private, owner or admin
router.get('/:id', protect, getOrderById);

module.exports = router;