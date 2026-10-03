const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET_KEY;

const fetchUser = (req, res, next) => {
    const token = req?.cookies?.password_manager_token;

    if (!token) {
        return res.status(401).json({ message: "Login Required" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.error("Token verification failed:", error);
        res.status(401).json({ message: "Please authenticate with a valid token." });
    }
}

module.exports = fetchUser;
