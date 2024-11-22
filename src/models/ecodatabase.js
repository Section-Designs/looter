const mongoose = require('mongoose');

const balanceSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    balance: {
        type: Number,
        default: 0
    }
});

const Balance = mongoose.model('Balance', balanceSchema);

module.exports = Balance;
