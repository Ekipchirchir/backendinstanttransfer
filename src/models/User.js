const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    fullname: { type: String, required: true },  // ✅ Ensure it's required
    email: { type: String, required: true, unique: true },
    deriv_account: { type: String, required: true, unique: true },
    access_token: { type: String, required: true }, 
    balance: { type: Number, default: 0 },
    currency: { type: String, default: "USD" }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
