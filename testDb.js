require("dotenv").config();
const mongoose = require("mongoose");

console.log("Attempting to connect to:", process.env.MONGO_URI);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ SUCCESS! Database is connected perfectly.");
    process.exit();
  })
  .catch((err) => {
    console.error("❌ FAILED to connect. Error details:");
    console.error(err.message);
    process.exit(1);
  });
