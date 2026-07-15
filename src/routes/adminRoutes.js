const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { adminProtect } = require("../middleware/adminMiddleware");
const {
  getAdminStats,
  getAllUsers,
  getAllApplications,
  updateApplicationStatus,
  verifyUserEmail,
  exportToExcel, // <-- جدید
  generateApplicationPDF, // <-- جدید
  deleteApplication,
  deleteUser,
} = require("../controllers/adminController");

router.use(protect);
router.use(adminProtect);

router.get("/stats", getAdminStats);
router.get("/users", getAllUsers);
router.get("/applications", getAllApplications);
router.put("/applications/:id/status", updateApplicationStatus);
router.put("/users/:id/verify", verifyUserEmail);

// مسیرهای جدید
router.get("/export/excel", exportToExcel);
router.get("/applications/:id/pdf", generateApplicationPDF);
router.delete("/applications/:id", deleteApplication);
router.delete("/users/:id", deleteUser);

module.exports = router;
