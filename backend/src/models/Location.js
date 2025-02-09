const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true
  },
  description: String,
  coordinates: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true,
      index: '2dsphere'
    }
  },
  type: {
    type: String,
    required: true,
    enum: ['LOCATION', 'PARKING', 'EQUIPMENT', 'CREW', 'CUSTOM']
  },
  photos: [{
    url: String,
    thumbnail: String,
    caption: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  notes: [{
    content: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create text index for search
LocationSchema.index({ name: 'text', description: 'text' });

// Update the updatedAt timestamp on save
LocationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Location', LocationSchema); 