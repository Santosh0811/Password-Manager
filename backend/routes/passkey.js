const bcrypt = require('bcrypt');
require('dotenv').config();
const express = require('express');
const router = express.Router();
const fetchUser = require('../middleware/fetchUser.js');
const Passkey = require('../models/passkey.js');
const Signup = require('../models/signup.js');
const CryptoJS = require("crypto-js");

// Encrypt
const encryptData = ({ data, SECRET_KEY }) => {
    return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
}

// Decrypt
const decryptData = ({ data, SECRET_KEY }) => {
    const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
}

router.get('/fetchPassword', fetchUser, async (req, res) => {
    try {
        const user = await Signup.findOne({ userId: req.userId }).select('userId email');

        if (!user) {
            return res.status(404).json({ message: "Login Required" });
        }

        const fetchPasskeys = await Passkey.findOne({ userId: user.userId });

        if (!fetchPasskeys || !fetchPasskeys.passKeys) {
            return res.status(404).json({ message: "No Passwords Found", passkeys: [] });
        }

        // decrypt all passwords
        const decryptedPasskeys = fetchPasskeys.passKeys.map((item) => ({
            ...item.toObject?.() || item,
            password: decryptData({
                data: item.password,
                SECRET_KEY: user.email
            })
        }));

        return res.status(200).json({
            message: "Password Fetched Successfully",
            passkeys: decryptedPasskeys
        });

    } catch (error) {
        console.error("Error while showing passwords:", error);
        return res.status(500).json({ message: "Error while Showing passwords" });
    }
});

router.post('/addPassword', fetchUser, async (req, res) => {
    try {
        const user = await Signup.findOne({ userId: req.userId }).select('userId email userName');

        if (!user) {
            return res.status(404).json({ message: "Login Required" });
        }

        const { site, username, password } = req.body;

        if (!site || !username || !password) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const existingBookmark = await Passkey.findOne({ userId: user.userId });

        const encryptedPassword = await encryptData({ data: password, SECRET_KEY: user.email });

        if (existingBookmark) {
            await Passkey.findOneAndUpdate({ userId: user.userId }, { $push: { passKeys: { site, username, password: encryptedPassword } } }, { new: true });
        } else {
            await Passkey.create({ userId: user.userId, userName: user.userName, email: user.email, passKeys: [{ site, username, password: encryptedPassword }] });
        }

        return res.status(201).json({ message: "Password saved successfully" });
    } catch (error) {
        console.error("Error while saving Password:", error);

        return res.status(500).json({ message: "Error while Saving Password" });
    }
});

router.put('/updatePassword/:id', fetchUser, async (req, res) => {
    try {
        const user = await Signup.findOne({ userId: req.userId }).select('userId email userName');

        if (!user) {
            return res.status(401).json({ message: "Login Required" });
        }

        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "Id not found" });
        }

        const { site, username, password } = req.body;

        if (!site || !username || !password) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const encryptedPassword = await encryptData({ data: password, SECRET_KEY: user.email });

        const updatedPassword = await Passkey.findOneAndUpdate(
            {
                userId: user.userId,
                "passKeys._id": id
            },
            {
                $set:
                {
                    "passKeys.$.site": site,
                    "passKeys.$.username": username,
                    "passKeys.$.password": encryptedPassword
                }
            }, { new: true });

        if (!updatedPassword) {
            return res.status(404).json({ message: "Password not updated" });
        }

        return res.status(200).json({ message: "Password Updated Successfully" });
    } catch (error) {
        console.error("Error while Updating the Password", error);
        return res.status(500).json({ message: "Error while Updating Password" });
    }
});

router.delete('/deletePassword/:id', fetchUser, async (req, res) => {
    try {
        const user = await Signup.findOne({ userId: req.userId }).select('userId -_id');

        if (!user) {
            return res.status(404).json({ message: "Login Required" });
        }

        const { id } = req.params;

        const deletedPassword = await Passkey.findOneAndUpdate(
            {
                userId: user.userId
            },
            {
                $pull: {
                    passKeys: {
                        _id: id
                    }
                }
            },
            { new: true }
        );

        if (!deletedPassword) {
            return res.status(404).json({ message: "Password not Deleted" });
        }

        return res.json({ message: "Password deleted successfully" });
    } catch (error) {
        console.error("Error while Deleting Password", error);
        res.status(500).json({ message: "Error while Deleting Password" });
    }
})

router.put('/changePasswordInside', fetchUser, async (req, res) => {
    try {
        const user = await Signup.findOne({ userId: req.userId });

        if (!user) {
            return res.status(404).json({ message: "Login Required" });
        }

        const { password } = req.body;

        if (!password || password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await user.updateOne({ password: hashedPassword });

        return res.status(200).json({ message: "Password Changed Successfully" });

    } catch (error) {
        console.error("Error while Changing Password:", error);
        res.status(500).json({ message: "Error while Changing Password" });
    }
});

module.exports = router;