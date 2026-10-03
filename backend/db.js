const mongoose = require('mongoose');
require('dotenv').config();

const dbUrl = process.env.MONGO_URI;

const db = async () => {
    try {
        await mongoose.connect(dbUrl);
        console.log("Mongoose is Connected Successfully");
    } catch (error) {
        console.log(error);
    }
}

module.exports = db;