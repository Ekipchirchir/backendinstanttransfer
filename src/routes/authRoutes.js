const express = require("express");
const router = express.Router();
const axios = require("axios");

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:8081";

router.get("/callback", async (req, res) => {
    console.log("✅ Received OAuth Callback:", req.query);

    // ✅ Extract the first Deriv token (primary account)
    const access_token = req.query.token1;
    const deriv_account = req.query.acct1;

    // ✅ Check if Deriv returned valid details
    if (!access_token || !deriv_account) {
        console.error("❌ Missing access token or Deriv account.");
        return res.status(400).json({ error: "Missing access token or Deriv account" });
    }

    // ✅ Redirect user to frontend with token
    const redirectUrl = `${FRONTEND_URL}/auth-success?access_token=${access_token}&deriv_account=${deriv_account}`;
    console.log(`✅ Redirecting user to: ${redirectUrl}`);

    res.redirect(redirectUrl);
});

module.exports = router;
