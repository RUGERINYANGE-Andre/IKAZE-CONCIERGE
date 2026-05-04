// server/models/File.js

const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    enum: ['itinerary', 'photo', 'video', 'document', 'report', 'other'],
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  publicId: {
    type: String, // Cloudinary public ID
  },
  fileSize: Number,
  mimeType: String,
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  description: String,
}, {
  timestamps: true,
});

module.exports = mongoose.model('File', fileSchema);