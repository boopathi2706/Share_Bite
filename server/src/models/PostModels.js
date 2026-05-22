const mongoose = require('mongoose');
const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    address: {
        type: String,
        required: true,
        trim: true,
    },
    district: {
        type: String,
        required: true,
        trim: true,
    },
    donor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    expiryHours: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['Available', 'Claimed', 'expired'],
        default: 'Available',
    },
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema);
