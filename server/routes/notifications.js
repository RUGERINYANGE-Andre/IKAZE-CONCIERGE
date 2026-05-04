// server/routes/notifications.js

const express = require('express');
const router = express.Router();
const { 
  sendTestWhatsApp, 
  sendTestEmail,
  resendOrderNotification 
} = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');

// Test endpoints (admin only)
router.post('/test/whatsapp', protect, adminOnly, sendTestWhatsApp);
router.post('/test/email', protect, adminOnly, sendTestEmail);

// Resend notification for specific order
router.post('/resend/:orderId', protect, adminOnly, resendOrderNotification);

module.exports = router;