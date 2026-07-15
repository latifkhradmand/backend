const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Step 1: Personal
    dateOfBirth: Date,
    gender: String,
    city: String,
    fullAddress: String,
    // Step 2: Contact & Docs
    passportFileUrl: String, // Path to uploaded passport
    // Step 3: Education
    schoolName: String,
    graduationYear: Number,
    germanCertType: String, // Goethe, ÖSD, TELC
    languageLevel: String, // A1, A2, B1...
    diplomaFileUrl: String, // Path to uploaded diploma
    translationFileUrl: String, // Path to uploaded translation
    // Step 4: Program
    firstChoiceField: String,
    secondChoiceField: String,
    workExperience: String,
    additionalNotes: String,
    // Status
    status: {
      type: String,
      enum: ["Pending Review", "Accepted", "Rejected"],
      default: "Pending Review",
    },
    photo3x4Url: { type: String }, // <-- این خط را اضافه کنید
    passportFileUrl: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Application", applicationSchema);
