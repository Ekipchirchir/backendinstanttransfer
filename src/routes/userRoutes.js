const express = require('express');
const User = require('../models/User'); // Adjust the path if needed
const router = express.Router();

// Fetch user details by Deriv account
router.get('/user/:deriv_account', async (req, res) => {
    try {
        const { deriv_account } = req.params;
        const user = await User.findOne({ deriv_account });

        if (!user) return res.status(404).json({ error: 'User not found' });

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
