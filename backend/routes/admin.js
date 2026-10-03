const express = require("express");
const adminAuth = require("../middleware/adminAuth");
const router = express.Router();
const Passkey = require('../models/passkey.js');
const Signup = require('../models/signup.js');

router.get("/passkeyUserData", adminAuth, async (req, res) => {
    try {
        const users = await Signup.find().select("-password");;

        if (users.length === 0) {
            return res.status(200).json({ success: true, data: [], message: "No users found in Password Manager" });
        }

        return res.status(200).json({ success: true, data: users, message: `${users.length} users fetched` });

    } catch (error) {
        console.log("Error while fetching Password Manager User Data", error);
        return res.status(404).json({ success: false, message: "Error while fetching Password Manager User Data" });
    }
})

router.delete("/passkeyUserDelete/:userId", adminAuth, async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: "No user found" });
        }

        const allPasskeys = await Passkey.deleteMany({ userId });

        if (!allPasskeys) {
            return res.status(404).json({ success: false, message: "All Passkeys not deleted" });
        }

        const deleteUser = await Signup.findOneAndDelete({ userId: userId });

        if (!deleteUser) {
            return res.status(404).json({ success: false, message: "User not deleted" });
        }

        return res.status(200).json({ success: true, message: "User and all related data deleted successfully" });

    } catch (error) {
        console.log("Error while deleting Password Manager User", error);
        return res.status(500).json({ success: false, message: "Error while deleting Password Manager User" });
    }
})

router.get("/passkeySiteData/:userId", adminAuth, async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: "No user found" });
        }

        const passwords = await Passkey.find({ userId: userId });

        if (passwords.length === 0) {
            return res.status(200).json({ success: true, data: [], message: "No passkeys found in Password manager" });
        }

        return res.status(200).json({ success: true, data: passwords, message: `${passwords.length} passwords found` });

    } catch (error) {
        console.log("Error while fetching Password Manager User passkeys", error);
        return res.status(404).json({ success: false, message: "Error while fetching Password Manager User passkeys" });
    }
})

router.delete("/passkeySiteDelete/:userId/:itemId", adminAuth, async (req, res) => {
    try {
        const { userId, itemId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: "No user found" });
        }

        if (!itemId) {
            return res.status(400).json({ message: "No item found" });
        }

        const deletePasskeys = await Passkey.updateOne({ userId: userId }, { $pull: { passKeys: { _id: itemId } } });

        if (deletePasskeys.deletedCount === 0) {
            return res.status(404).json({ message: "Passkey not found" });
        }

        return res.status(200).json({
            message: "Passkey deleted successfully"
        });

    } catch (error) {
        console.log("Error while deleteing Password manager User passkeys", error);
        return res.status(500).json({ success: false, message: "Error while deleting Password manager User passkeys" });
    }
})

module.exports = router;