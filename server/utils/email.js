// server/utils/email.js

const transporter = require('../config/email');

exports.sendEmailNotification = async (order) => {
  const mailOptions = {
    from: `"Ikaze Concierge" <${process.env.EMAIL_USER}>`,
    to: process.env.BUSINESS_EMAIL || process.env.EMAIL_USER,
    subject: `🎯 New Booking: ${order.orderNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1BA19C 0%, #158B87 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .info-row { margin: 15px 0; padding: 10px; background: white; border-radius: 5px; }
          .label { font-weight: bold; color: #1BA19C; }
          .button { display: inline-block; padding: 12px 30px; background: #1BA19C; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎯 New Booking Received</h1>
            <p>Order #${order.orderNumber}</p>
          </div>
          <div class="content">
            <div class="info-row">
              <span class="label">Client:</span> ${order.client.name}
            </div>
            <div class="info-row">
              <span class="label">Email:</span> ${order.client.email}
            </div>
            <div class="info-row">
              <span class="label">Phone:</span> ${order.client.phone}
            </div>
            <div class="info-row">
              <span class="label">Service:</span> ${order.serviceSnapshot.name}
            </div>
            <div class="info-row">
              <span class="label">Amount:</span> $${order.serviceSnapshot.price} USD
            </div>
            <div class="info-row">
              <span class="label">Arrival Date:</span> ${new Date(order.visitDetails.arrivalDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <div class="info-row">
              <span class="label">Number of People:</span> ${order.visitDetails.numberOfPeople}
            </div>
            ${order.visitDetails.specialRequests ? `
            <div class="info-row">
              <span class="label">Special Requests:</span><br/>
              ${order.visitDetails.specialRequests}
            </div>
            ` : ''}
            <a href="${process.env.CLIENT_URL}/admin/orders/${order._id}" class="button">View in Dashboard</a>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Email notification sent');
    return { success: true };
  } catch (error) {
    console.error('❌ Email error:', error);
    throw error;
  }
};

exports.sendClientConfirmationEmail = async (order) => {
  const mailOptions = {
    from: `"Ikaze Concierge" <${process.env.EMAIL_USER}>`,
    to: order.client.email,
    subject: `Booking Confirmed - ${order.orderNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1BA19C 0%, #158B87 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .info-box { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
          h2 { color: #1BA19C; }
          .footer { text-align: center; margin-top: 30px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Booking Confirmed!</h1>
            <p>Murakoze! Thank you for choosing Ikaze Concierge</p>
          </div>
          <div class="content">
            <p>Dear ${order.client.name},</p>
            <p>We're excited to help plan your visit to Rwanda! Your booking has been confirmed.</p>
            
            <div class="info-box">
              <h2>Booking Details</h2>
              <p><strong>Order Number:</strong> ${order.orderNumber}</p>
              <p><strong>Service:</strong> ${order.serviceSnapshot.name}</p>
              <p><strong>Arrival Date:</strong> ${new Date(order.visitDetails.arrivalDate).toLocaleDateString()}</p>
              <p><strong>Amount:</strong> $${order.serviceSnapshot.price} USD</p>
            </div>

            <h3>What's Next?</h3>
            <ol>
              <li>Our team will review your booking within 24 hours</li>
              <li>We'll reach out via WhatsApp and email to begin planning</li>
              <li>You can track your order status in your client dashboard</li>
            </ol>

            <div class="footer">
              <p>Questions? Contact us on WhatsApp: ${process.env.WHATSAPP_NUMBER}</p>
              <p>© ${new Date().getFullYear()} Ikaze Concierge & Logistics</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Client confirmation email sent');
    return { success: true };
  } catch (error) {
    console.error('❌ Email error:', error);
    throw error;
  }
};