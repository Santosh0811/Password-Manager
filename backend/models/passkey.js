const mongoose = require('mongoose');

const passkey = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },

    userName: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    passKeys: [
        {
            site: {
                type: String,
                required: true,
                trim: true
            },

            username: {
                type: String,
                required: true,
                trim: true
            },

            password: {
                type: String,
                default: ""
            }
        }
    ]

}, { timestamps: true });

const passkeySchema = mongoose.model("Passkeys", passkey);

module.exports = passkeySchema;