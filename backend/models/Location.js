const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  category: { type: String, required: true },
  specs: {
    power: String,
    parking: String,
    squareFootage: Number,
    bathrooms: Number,
    amps: String,
    floors: Number,
    elevator: Boolean,
    theftRating: Number
  },
  neighborhood: {
    safetyRating: Number,
    neighborIssues: String,
    curfew: String,
    nearbyAmenities: [String]
  },
  photos: [{
    url: String,
    caption: String,
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    uploadDate: Date
  }],
  ratings: [{
    score: Number,
    department: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: Date
  }],
  comments: [{
    text: String,
    department: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: Date
  }],
  privacy: {
    type: String,
    enum: ['private', 'shared', 'public'],
    default: 'private'
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Location', locationSchema); 