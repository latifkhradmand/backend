require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./src/models/User");

const checkUsers = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const users = await User.find().select(
    "firstName lastName email role isVerified",
  );

  console.log("\n=========================================");
  console.log("📋 CURRENT USERS IN DATABASE:");
  console.log("=========================================");
  if (users.length === 0) {
    console.log(
      "❌ No users found! You need to register or run createAdmin.js",
    );
  } else {
    console.table(users);
  }
  console.log("=========================================\n");
  process.exit();
};

checkUsers();
