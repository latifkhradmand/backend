require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const resetAndCreate = async () => {
  try {
    console.log("Connecting to database...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to Database");

    const plainPassword = "Password123";
    console.log("Hashing password...");
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Use native MongoDB collection to bypass ANY Mongoose model buffering issues
    const db = mongoose.connection.db;
    const usersCollection = db.collection("users");

    console.log("Clearing old test accounts...");
    await usersCollection.deleteMany({
      email: { $in: ["admin@ausbildung.com", "test@test.com"] },
    });

    console.log("Creating Admin account...");
    await usersCollection.insertOne({
      firstName: "Admin",
      lastName: "User",
      email: "admin@ausbildung.com",
      password: hashedPassword,
      role: "admin",
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log("✅ Admin account created!");

    console.log("Creating Test User account...");
    await usersCollection.insertOne({
      firstName: "Test",
      lastName: "User",
      email: "test@test.com",
      password: hashedPassword,
      role: "user",
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log("✅ Test User account created!");

    console.log("\n=========================================");
    console.log("🔑 USE THESE EXACT CREDENTIALS:");
    console.log("=========================================");
    console.log("👑 FOR ADMIN PANEL (admin.html):");
    console.log("   Email:    admin@ausbildung.com");
    console.log("   Password: " + plainPassword);
    console.log("-----------------------------------------");
    console.log("👤 FOR USER PORTAL (index.html):");
    console.log("   Email:    test@test.com");
    console.log("   Password: " + plainPassword);
    console.log("=========================================\n");

    process.exit();
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

resetAndCreate();
