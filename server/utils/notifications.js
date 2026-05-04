// server/utils/notifications.js

const { sendWhatsAppNotification } = require('./whatsapp');
const { sendEmailNotification, sendClientConfirmationEmail } = require('./email');

/**
 * Send all notifications for an order
 * @param {Object} order - Order object with populated client and service
 * @returns {Object} Results of notification attempts
 */
const sendAllNotifications = async (order) => {
  const results = {
    whatsapp: { success: false, error: null },
    email: { success: false, error: null },
    clientEmail: { success: false, error: null },
  };

  // Send WhatsApp notification to admin
  try {
    const whatsappResult = await sendWhatsAppNotification(order);
    results.whatsapp = { success: true, data: whatsappResult };
  } catch (error) {
    console.error('WhatsApp notification failed:', error);
    results.whatsapp = { success: false, error: error.message };
  }

  // Send email notification to admin
  try {
    await sendEmailNotification(order);
    results.email = { success: true };
  } catch (error) {
    console.error('Admin email notification failed:', error);
    results.email = { success: false, error: error.message };
  }

  // Send confirmation email to client
  try {
    await sendClientConfirmationEmail(order);
    results.clientEmail = { success: true };
  } catch (error) {
    console.error('Client email notification failed:', error);
    results.clientEmail = { success: false, error: error.message };
  }

  return results;
};

/**
 * Send status update notification to client
 * @param {Object} order - Order object
 * @param {String} newStatus - New status
 * @param {String} note - Optional note
 */
const sendStatusUpdateNotification = async (order, newStatus, note) => {
  const transporter = require('../config/email');

  const statusEmoji = {
    pending: '⏳',
    in_progress: '🔄',
    completed: '✅',
    cancelled: '❌',
  };

  const statusLabels = {
    pending: 'Pending',
    in_progress: 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
  };

  const mailOptions = {
    from: `"Ikaze Concierge" <${process.env.EMAIL_USER}>`,
    to: order.client.email,
    subject: `Order Update: ${order.orderNumber} - ${statusLabels[newStatus]}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1BA19C 0%, #158B87 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .status-badge { display: inline-block; padding: 10px 20px; border-radius: 20px; font-weight: bold; margin: 20px 0; }
          .info-box { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${statusEmoji[newStatus]} Order Status Updated</h1>
            <p>Order #${order.orderNumber}</p>
          </div>
          <div class="content">
            <p>Dear ${order.client.name},</p>
            <p>Your order status has been updated:</p>
            
            <div class="status-badge" style="background: ${
              newStatus === 'completed' ? '#10B981' :
              newStatus === 'in_progress' ? '#3B82F6' :
              newStatus === 'pending' ? '#F59E0B' : '#EF4444'
            }; color: white;">
              ${statusLabels[newStatus]}
            </div>

            ${note ? `
              <div class="info-box">
                <strong>Note from our team:</strong>
                <p>${note}</p>
              </div>
            ` : ''}

            <div class="info-box">
              <h3>Order Details</h3>
              <p><strong>Service:</strong> ${order.serviceSnapshot?.name || order.service?.name}</p>
              <p><strong>Arrival Date:</strong> ${new Date(order.visitDetails?.arrivalDate).toLocaleDateString()}</p>
            </div>

            ${newStatus === 'completed' ? `
              <p style="background: #EFF6FF; padding: 15px; border-radius: 5px; border-left: 4px solid #3B82F6;">
                🎉 <strong>Congratulations!</strong> Your order is complete. All deliverables should be available in your dashboard.
              </p>
            ` : ''}

            <p style="margin-top: 30px;">
              <a href="${process.env.CLIENT_URL}/dashboard" style="display: inline-block; padding: 12px 30px; background: #1BA19C; color: white; text-decoration: none; border-radius: 5px;">
                View in Dashboard
              </a>
            </p>

            <p style="margin-top: 30px; color: #666; font-size: 14px;">
              Questions? Reply to this email or contact us on WhatsApp: ${process.env.WHATSAPP_NUMBER}
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Status update email sent to client');
    return { success: true };
  } catch (error) {
    console.error('❌ Status update email failed:', error);
    throw error;
  }
};

/**
 * Send new file upload notification to client
 * @param {Object} order - Order object
 * @param {Array} files - Array of uploaded files
 */
const sendFileUploadNotification = async (order, files) => {
  const transporter = require('../config/email');

  const fileList = files.map(file => `
    <li style="padding: 10px; background: white; margin: 5px 0; border-radius: 5px;">
      <strong>${file.fileName}</strong> (${file.fileType})
    </li>
  `).join('');

  const mailOptions = {
    from: `"Ikaze Concierge" <${process.env.EMAIL_USER}>`,
    to: order.client.email,
    subject: `New Files Available - Order ${order.orderNumber}`,
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
            <h1>📎 New Files Available</h1>
            <p>Order #${order.orderNumber}</p>
          </div>
          <div class="content">
            <p>Dear ${order.client.name},</p>
            <p>We've uploaded ${files.length} new file${files.length > 1 ? 's' : ''} to your order:</p>
            
            <ul style="list-style: none; padding: 0;">
              ${fileList}
            </ul>

            <p style="margin-top: 30px;">
              <a href="${process.env.CLIENT_URL}/dashboard" style="display: inline-block; padding: 12px 30px; background: #1BA19C; color: white; text-decoration: none; border-radius: 5px;">
                View & Download Files
              </a>
            </p>

            <p style="margin-top: 30px; color: #666; font-size: 14px;">
              All your files are securely stored and available anytime in your dashboard.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ File upload notification sent to client');
    return { success: true };
  } catch (error) {
    console.error('❌ File upload notification failed:', error);
    throw error;
  }
};

module.exports = {
  sendAllNotifications,
  sendStatusUpdateNotification,
  sendFileUploadNotification,
};