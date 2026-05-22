const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
    },
    role: {
        type: String,
        enum: ['Donor', 'Receiver'],
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    district: {
        type: String,
        required: true,
        trim: true,
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    banned:{
        type: Boolean,
        enum: [true, false],
        default: false,
    }
}, { timestamps: true });


module.exports = mongoose.model('User', UserSchema);