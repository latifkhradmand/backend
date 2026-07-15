const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    fatherName: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: String,
    whatsapp: String,
    passportNumber: String,
    passportExpiryDate: Date,
    nationality: String,
    isVerified: { type: Boolean, default: false },
    verificationCode: String,
    verificationCodeExpires: Date,
    memberSince: { type: Date, default: Date.now },
    // Add this line inside the userSchema, right after 'isVerified':
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
