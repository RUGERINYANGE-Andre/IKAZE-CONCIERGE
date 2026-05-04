// client/src/services/whatsappService.js

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '250789765744';

export const whatsappService = {
  generateBookingMessage: (orderData) => {
    const message = `Hello Ikaze Concierge, I would like to book ${orderData.serviceName} for ${new Date(orderData.arrivalDate).toLocaleDateString()}. My name is ${orderData.clientName}.`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  },

  openWhatsApp: (message = 'Hello Ikaze Concierge!') => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  },
};