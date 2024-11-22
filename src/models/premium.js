const mongoose = require('mongoose');

const premiumSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('PremiumUser', premiumSchema);
