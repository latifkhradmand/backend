const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { upload } = require("../middleware/uploadMiddleware");
const {
  createApplication,
  getMyApplications,
} = require("../controllers/applicationController");

router.post(
  "/",
  protect,
  upload.fields([
    { name: "passport", maxCount: 1 },
    { name: "diploma", maxCount: 1 },
    { name: "translation", maxCount: 1 },
  ]),
  createApplication,
);

router.get("/my", protect, getMyApplications);

module.exports = router;
