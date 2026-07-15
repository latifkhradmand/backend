require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./src/models/User");

const fixUser = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  // 1. Show all users currently in the database
  const users = await User.find().select(
    "firstName lastName email role isVerified",
  );
  console.log("\n📋 CURRENT USERS IN DATABASE:");
  if (users.length === 0)
    console.log("❌ No users found! You need to register first.");
  else console.table(users);

  // 2. Get the email from the command line argument
  const emailToFix = process.argv[2];

  if (!emailToFix) {
    console.log(
      "\n⚠️  Please provide the email. Example: node fixLogin.js your@email.com",
    );
    process.exit();
  }

  const user = await User.findOne({ email: emailToFix });
  if (!user) {
    console.log(
      `\n❌ User "${emailToFix}" not found in database. Did you type it correctly?`,
    );
    process.exit();
  }

  // 3. Reset password to 'Test@1234' and force verify the email
  const newPassword = "Test@1234";
  user.password = await bcrypt.hash(newPassword, 10);
  user.isVerified = true; // Bypasses the email OTP requirement
  await user.save();

  console.log(`\n✅ SUCCESS! You can now log in with:`);
  console.log(`📧 Email: ${user.email}`);
  console.log(`🔑 Password: ${newPassword}`);
  console.log(`✨ Status: Verified\n`);

  process.exit();
};

fixUser();
