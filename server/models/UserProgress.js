const mongoose = require('mongoose');

const UserProgressSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  completed: { type: Map, of: Boolean, default: {} },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UserProgress', UserProgressSchema);
