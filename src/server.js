const dotenv = require("dotenv");
dotenv.config(); // Load .env variables
const connectDB = require("./config/db");
const app = require("./app");

const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
