// server/controllers/notificationController.js

const Order = require('../models/Order');
const { sendWhatsAppNotification } = require('../utils/whatsapp');
const { sendEmailNotification, sendClientConfirmationEmail } = require('../utils/email');

// @desc    Send test WhatsApp notification
// @route   POST /api/notifications/test/whatsapp
// @access  Private/Admin
exports.sendTestWhatsApp = async (req, res) => {
  try {
    const { phoneNumber, message } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    const testMessage = message || 'Hello! This is a test message from Ikaze Concierge. 🎯';

    // Generate WhatsApp URL
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(testMessage)}`;

    res.json({
      success: true,
      message: 'WhatsApp link generated successfully',
      data: {
        url: whatsappUrl,
        phoneNumber,
        message: testMessage,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send test email
// @route   POST /api/notifications/test/email
// @access  Private/Admin
exports.sendTestEmail = async (req, res) => {
  try {
    const { email, subject, message } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const transporter = require('../config/email');

    const mailOptions = {
      from: `"Ikaze Concierge" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: subject || 'Test Email from Ikaze Concierge',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1BA19C 0%, #158B87 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Test Email</h1>
            </div>
            <div class="content">
              <p>${message || 'This is a test email from Ikaze Concierge. If you received this, your email configuration is working correctly! 🎉'}</p>
              <p style="margin-top: 20px; color: #666;">
                Sent at: ${new Date().toLocaleString()}
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: 'Test email sent successfully',
      data: {
        recipient: email,
        subject: mailOptions.subject,
      },
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to send test email',
      error: error.message 
    });
  }
};

// @desc    Resend notification for order
// @route   POST /api/notifications/resend/:orderId
// @access  Private/Admin
exports.resendOrderNotification = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { type } = req.body; // 'whatsapp', 'email', or 'both'

    const order = await Order.findById(orderId)
      .populate('client', 'name email phone')
      .populate('service', 'name price');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const results = {
      whatsapp: null,
      email: null,
    };

    try {
      if (type === 'whatsapp' || type === 'both') {
        results.whatsapp = await sendWhatsAppNotification(order);
      }

      if (type === 'email' || type === 'both') {
        results.email = await sendEmailNotification(order);
        
        // Also send client confirmation
        await sendClientConfirmationEmail(order);
      }

      res.json({
        success: true,
        message: 'Notifications resent successfully',
        data: results,
      });
    } catch (notifError) {
      res.status(500).json({
        success: false,
        message: 'Failed to send notifications',
        error: notifError.message,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};