const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Helper function to ensure the directory exists, creating it if necessary
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadDir = "src/uploads/certificates/"; // Default fallback

    // Route files to specific folders based on fieldname
    if (file.fieldname === "passport" || file.fieldname === "document") {
      uploadDir = "src/uploads/passports/";
    } else if (file.fieldname === "diploma") {
      uploadDir = "src/uploads/diplomas/";
    }

    // Automatically create the folder if it doesn't exist
    ensureDir(uploadDir);

    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname),
    );
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase(),
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error("Only images (jpg, png) and PDFs are allowed!"));
};

exports.upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Optional: 5MB file size limit
});
