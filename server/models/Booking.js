const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', default: null },
  pickupLocation: { type: { type: String, default: 'Point' }, coordinates: [Number] },
  dropoffLocation: { type: { type: String, default: 'Point' }, coordinates: [Number] },
  price: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'in_transit', 'completed', 'cancelled'], default: 'pending' },
}, { timestamps: true });

BookingSchema.index({ pickupLocation: '2dsphere' });
BookingSchema.index({ dropoffLocation: '2dsphere' });

module.exports = mongoose.model('Booking', BookingSchema);
