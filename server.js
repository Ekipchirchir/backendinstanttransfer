require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const WebSocket = require("ws");
const User = require("./src/models/User");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Import Routes
const userRoutes = require("./src/routes/userRoutes"); // Ensure the path is correct

// Use Routes
app.use("/api", userRoutes); // Now user routes are accessible via `/api/user/:deriv_account`

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB Connection Error:", err));

// Existing WebSocket functions here...

// 🔹 OAuth Callback Route
app.get("/callback", async (req, res) => {
    console.log("✅ Received OAuth Callback:", req.query);

    const derivToken = req.query.token1;
    const derivAccount = req.query.acct1;

    if (!derivToken || !derivAccount) {
        console.error("❌ Missing authorization token or account ID");
        return res.status(400).json({ error: "Missing authorization data" });
    }

    try {
        const userInfo = await getDerivUserInfo(derivToken);
        const userBalance = await getDerivBalance(derivToken);

        console.log("✅ User Info Retrieved:", userInfo);

        const userFullname = userInfo.fullname ? userInfo.fullname.trim() : "Unknown User";

        let user = await User.findOneAndUpdate(
            { deriv_account: derivAccount },
            {
                fullname: userFullname,
                email: userInfo.email || `user_${derivAccount}@deriv.com`,
                access_token: derivToken,
                balance: userBalance,
                currency: userInfo.currency || "USD",
            },
            { upsert: true, new: true }
        );

        console.log("✅ User Stored in MongoDB:", user);

        const redirectURL = `${process.env.FRONTEND_URL}/auth-success?access_token=${derivToken}&deriv_account=${derivAccount}`;
        console.log("✅ Redirecting user to:", redirectURL);

        res.redirect(redirectURL);
    } catch (error) {
        console.error("❌ Error processing callback:", error.message);
        return res.status(500).json({ error: error.message });
    }
});

// 🔹 Default Route
app.get("/", (req, res) => {
    res.send("🚀 Instant Transfer Backend is Running...");
});

// 🔹 Start Server
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
