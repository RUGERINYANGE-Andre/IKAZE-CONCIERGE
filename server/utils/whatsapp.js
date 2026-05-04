// server/utils/whatsapp.js

const WHATSAPP_NUMBER = process.env.WHATSAPP_NUMBER || '250789765744';

exports.sendWhatsAppNotification = async (order) => {
  // Format message
  const message = `
🎯 NEW BOOKING - IKAZE CONCIERGE

📋 Order: ${order.orderNumber}
👤 Client: ${order.client.name}
📧 Email: ${order.client.email}
📞 Phone: ${order.client.phone}

🛎️ Service: ${order.serviceSnapshot.name}
💰 Amount: $${order.serviceSnapshot.price}

📅 Arrival: ${new Date(order.visitDetails.arrivalDate).toLocaleDateString()}
👥 People: ${order.visitDetails.numberOfPeople}

${order.visitDetails.specialRequests ? `📝 Special Requests:\n${order.visitDetails.specialRequests}` : ''}

🔗 View order in admin dashboard
  `.trim();

  // In production, integrate with WhatsApp Business API
  // For now, we return the WhatsApp click-to-chat URL
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  console.log('📱 WhatsApp notification prepared:', whatsappUrl);
  
  return {
    success: true,
    url: whatsappUrl,
    message,
  };
};

exports.generateClientWhatsAppLink = (orderData) => {
  const message = `Hello Ikaze Concierge, I would like to book ${orderData.serviceName} for ${new Date(orderData.arrivalDate).toLocaleDateString()}. My name is ${orderData.clientName}.`;
  
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};