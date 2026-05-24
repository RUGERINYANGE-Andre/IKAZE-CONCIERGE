// server/routes/auth.js

const express = require('express');
const router = express.Router();
const {
  registerClient,
  registerAdmin,   // ✅ Make sure this is imported
  loginClient,
  loginAdmin,
  getMe,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// ─── Register Routes ───────────────────────────────────────
router.post('/register/client', registerClient);  // POST /api/auth/register/client
router.post('/register/admin', registerAdmin);    // POST /api/auth/register/admin
// router.post('/register', registerClient);         // POST /api/auth/register (old route)

// ─── Login Routes ──────────────────────────────────────────
router.post('/login/client', loginClient);        // POST /api/auth/login/client
router.post('/login/admin', loginAdmin);          // POST /api/auth/login/admin

// ─── Protected Routes ──────────────────────────────────────
router.get('/me', protect, getMe);                // GET /api/auth/me

module.exports = router;