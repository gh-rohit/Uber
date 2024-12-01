const userModel = require('../models/user-model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
module.exports.authUser = async (req, res, next) => {
    try {
        // Extract token from cookies or headers
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' }); // Stop further execution
        }

        // Check if the token is blacklisted
        const isBlacklisted = await userModel.findOne({ token: token });
        if (isBlacklisted) {
            return res.status(401).json({ message: 'Unauthorized' }); // Stop further execution
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findOne({ _id: decoded._id });
        if (!user) {
            return res.status(401).json({ message: 'User not found' }); // Handle missing user
        }

        req.user = user;
        return next(); // Proceed to the next middleware
    } catch (err) {
        if (!res.headersSent) {
            res.status(403).json({ message: err.message }); // Send error response
        } else {
            console.error("Error after response sent:", err);
        }
    }
};
