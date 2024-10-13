const mongoose = require('mongoose');

const DriverSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  location: { type: { type: String, default: 'Point' }, coordinates: [Number] },
  active: { type: Boolean, default: true },
  available: { type: Boolean, default: true }
}, { timestamps: true });

DriverSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Driver', DriverSchema);
