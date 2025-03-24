const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    user_id: { type: Number, unique: true, required: true },  // Ensure user_id is stored
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    deriv_account: { type: String, required: true, unique: true },
    access_token: { type: String },
    balance: { type: Number, default: 0 },
    currency: { type: String, default: "USD" },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
