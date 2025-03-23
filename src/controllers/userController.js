const User = require("../models/User");  // If the file is named User.js

// ✅ Register a New User
const registerUser = async (req, res) => {
    try {
        const { deriv_account, username, balance } = req.body;

        // Check if user exists
        let user = await User.findOne({ deriv_account });
        if (user) {
            return res.status(400).json({ error: "User already exists" });
        }

        // Create new user
        user = new User({ deriv_account, username, balance });
        await user.save();

        res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

// ✅ Get User by Deriv Account
const getUserByDerivAccount = async (req, res) => {
    try {
        const user = await User.findOne({ deriv_account: req.params.deriv_account });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

module.exports = { registerUser, getUserByDerivAccount };
