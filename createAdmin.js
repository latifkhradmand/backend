require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./src/models/User");

const createAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to DB...");

  const hashedPassword = await bcrypt.hash("Admin@12345", 10); // Change this password!

  const admin = await User.findOneAndUpdate(
    { email: "admin@ausbildung.com" },
    {
      firstName: "Super",
      lastName: "Admin",
      email: "admin@ausbildung.com",
      password: hashedPassword,
      role: "admin",
      isVerified: true,
    },
    { upsert: true, new: true },
  );

  console.log("✅ Admin created successfully!");
  console.log("Email: admin@ausbildung.com");
  console.log("Password: Admin@12345");
  process.exit();
};

createAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
