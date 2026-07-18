const express = require("express");
const cors = require("cors");
const app = express();

// ✅ 1. ENABLE CORS (Replace with your actual GitHub Pages URL)
app.use(cors({
  origin: ["https://latifkhradmand.github.io", "http://localhost:5173"], // <-- CHANGE THIS!
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ✅ 2. PARSE JSON BODIES
app.use(express.json());

// ✅ 3. DEFINE YOUR ROUTES (Make sure they are prefixed with /api)
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/applications", require("./routes/applications"));

// ✅ 4. ROOT ROUTE (For testing if the server is alive)
app.get("/", (req, res) => {
  res.send("✅ Ausbildung Backend is Running Successfully!");
});

module.exports = app;
