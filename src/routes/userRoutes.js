const express = require("express");
const router = express.Router();
const User = require("../models/User"); // ✅ Import User model

// ✅ Fetch User Data
router.get("/user/:deriv_account", async (req, res) => {
    try {
        const { deriv_account } = req.params;
        console.log("🔍 Fetching user data for:", deriv_account);

        const user = await User.findOne({ deriv_account });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(user);
    } catch (error) {
        console.error("❌ Error fetching user:", error);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
