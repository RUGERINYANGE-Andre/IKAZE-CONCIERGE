// server/routes/admin.js

const express = require('express');
const router = express.Router();

const {
  createService,
  updateService,
  deleteService,
  toggleServiceStatus,
  getAllServices,
} = require('../controllers/serviceController');
// Change this line at the top:
const {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  uploadFiles,
  getAnalytics,
  getAllUsers,        // ← add
  toggleUserStatus,  // ← add
} = require('../controllers/adminController');

// Add these two lines at the bottom before module.exports:
router.get('/users', getAllUsers);
router.patch('/users/:id/toggle', toggleUserStatus);


const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');
const upload = require('../middleware/upload');

// All admin routes require auth + admin role
router.use(protect);
router.use(adminOnly);

// ─── Orders ───────────────────────────────────────────────
router.get('/orders', getAllOrders);
router.patch('/orders/:id/status', updateOrderStatus);
router.post('/orders/:id/files', upload.array('files', 10), uploadFiles);
router.delete('/orders/:id', deleteOrder);

// ─── Analytics ────────────────────────────────────────────
router.get('/analytics', getAnalytics);

// ─── Services ─────────────────────────────────────────────
router.get('/services', getAllServices);                    // all including inactive
router.post('/services', createService);
router.put('/services/:id', updateService);
router.patch('/services/:id/toggle', toggleServiceStatus); // ✅ toggle active
router.delete('/services/:id', deleteService);

module.exports = router;