const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const signup = new mongoose.Schema({
    userId: {
        type: String,
        default: uuidv4
    },

    userName: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    otp: {
        type: String,
        default: null
    },

    otpExpireAt: {
        type: String,
        default: null
    },

    verified: {
        type: Boolean,
        default: false,
        required: true
    },

}, { timestamps: true });

const signupSchema = mongoose.model("Signup", signup);

module.exports = signupSchema;