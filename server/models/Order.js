// server/models/Order.js

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    serviceSnapshot: {
      name: String,
      price: Number,
      currency: { type: String, default: 'USD' },
    },
    visitDetails: {
      arrivalDate: { type: Date, required: true },
      departureDate: Date,
      numberOfPeople: { type: Number, default: 1 },
      specialRequests: String,
    },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed', 'cancelled'],
      default: 'pending',
    },
    // ✅ statusHistory includes updatedBy
    statusHistory: [
      {
        status: String,
        note: String,
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    // ✅ files reference File model
    files: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File',
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'pending',
    },
    notes: [
      {
        author: String,
        content: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
    notificationsSent: {
      whatsapp: { type: Boolean, default: false },
      email: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

// ✅ Auto-generate order number
orderSchema.pre('save', async function (next) {
  if (this.isNew) {
    const count = await mongoose.model('Order').countDocuments();
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    this.orderNumber = `IK-${year}${month}-${(count + 1).toString().padStart(4, '0')}`;

    // Add initial status history entry
    this.statusHistory.push({
      status: this.status,
      note: 'Order created',
      timestamp: new Date(),
    });
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);