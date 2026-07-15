const User = require("../models/User");
const Application = require("../models/Application");
const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

// @desc    Get dashboard stats
exports.getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalApps = await Application.countDocuments();
    const pendingApps = await Application.countDocuments({
      status: "Pending Review",
    });
    const acceptedApps = await Application.countDocuments({
      status: "Accepted",
    });

    res.json({ totalUsers, totalApps, pendingApps, acceptedApps });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" })
      .select("-password")
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all applications with user details
exports.getAllApplications = async (req, res) => {
  try {
    const apps = await Application.find()
      .populate("userId", "firstName lastName email phone")
      .sort({ createdAt: -1 });
    res.json(apps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update application status
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const app = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );
    res.json(app);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Manually verify a user's email
exports.verifyUserEmail = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true },
    );
    res.json({ message: "User verified successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Export all applications to Excel
exports.exportToExcel = async (req, res) => {
  try {
    const apps = await Application.find().populate(
      "userId",
      "firstName lastName email phone",
    );

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Applications");

    sheet.columns = [
      { header: "Applicant Name", key: "name", width: 25 },
      { header: "Email", key: "email", width: 30 },
      { header: "Phone", key: "phone", width: 20 },
      { header: "Nationality", key: "nationality", width: 20 },
      { header: "First Choice", key: "field1", width: 25 },
      { header: "Second Choice", key: "field2", width: 25 },
      { header: "German Level", key: "langLevel", width: 15 },
      { header: "Status", key: "status", width: 20 },
      { header: "Submission Date", key: "date", width: 20 },
    ];

    sheet.getRow(1).font = { bold: true };

    apps.forEach((app) => {
      sheet.addRow({
        name: `${app.userId?.firstName || ""} ${app.userId?.lastName || ""}`,
        email: app.userId?.email || "",
        phone: app.phone || app.userId?.phone || "",
        nationality: app.nationality || "",
        field1: app.firstChoiceField || "",
        field2: app.secondChoiceField || "",
        langLevel: app.languageLevel || "",
        status: app.status || "Pending",
        date: new Date(app.createdAt).toLocaleDateString(),
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=Ausbildung_Applications.xlsx",
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate and download PDF for a specific application
exports.generateApplicationPDF = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id).populate("userId");
    if (!app) return res.status(404).json({ message: "Application not found" });

    const doc = new PDFDocument({ margin: 50, size: "A4" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Application_${app._id}.pdf`,
    );
    doc.pipe(res);

    // Header
    doc
      .fontSize(22)
      .font("Helvetica-Bold")
      .text("Ausbildung Application Report", { align: "center" });
    doc.moveDown(0.5);
    doc
      .fontSize(12)
      .font("Helvetica")
      .text(`Generated on: ${new Date().toLocaleDateString()}`, {
        align: "center",
      });
    doc.moveDown(1);
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(1);

    // 1. Applicant Information
    doc
      .fontSize(16)
      .font("Helvetica-Bold")
      .text("1. Applicant Information", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12).font("Helvetica");
    doc.text(
      `Full Name: ${app.userId?.firstName || ""} ${app.userId?.lastName || ""}`,
    );
    doc.text(`Email: ${app.userId?.email || ""}`);
    doc.text(`Phone: ${app.phone || app.userId?.phone || "N/A"}`);
    doc.text(`WhatsApp: ${app.whatsapp || "N/A"}`);
    doc.text(`Nationality: ${app.nationality || "N/A"}`);
    doc.text(
      `Date of Birth: ${app.dateOfBirth ? new Date(app.dateOfBirth).toLocaleDateString() : "N/A"}`,
    );
    doc.moveDown(1);

    // 2. Application Details
    doc
      .fontSize(16)
      .font("Helvetica-Bold")
      .text("2. Application Details", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12).font("Helvetica");
    doc.text(`First Choice Field: ${app.firstChoiceField || "N/A"}`);
    doc.text(`Second Choice Field: ${app.secondChoiceField || "N/A"}`);
    doc.text(`Work Experience: ${app.workExperience || "N/A"}`);
    doc.text(
      `German Certificate: ${app.germanCertType || "N/A"} (Level: ${app.languageLevel || "N/A"})`,
    );
    doc.text(
      `School/Institution: ${app.schoolName || "N/A"} (Graduated: ${app.graduationYear || "N/A"})`,
    );
    doc.text(`Additional Notes: ${app.additionalNotes || "None"}`);
    doc.moveDown(1);

    // 3. Uploaded Documents (Images resized and formatted)
    doc
      .fontSize(16)
      .font("Helvetica-Bold")
      .text("3. Uploaded Documents", { underline: true });
    doc.moveDown(0.5);

    const baseDir = path.join(__dirname, ".."); // Points to 'src' folder

    const addDocumentToPDF = (label, filePath) => {
      if (filePath && fs.existsSync(path.join(baseDir, filePath))) {
        doc
          .fontSize(14)
          .font("Helvetica-Bold")
          .text(`- ${label}`, { underline: true });
        doc.moveDown(0.5);
        try {
          // Resize image to fit nicely within A4 width (max 500x600)
          doc.image(path.join(baseDir, filePath), {
            fit: [500, 600],
            align: "center",
          });
          doc.moveDown(1);
        } catch (err) {
          doc
            .fontSize(10)
            .font("Helvetica")
            .text(`[Error loading image: ${err.message}]`, { color: "red" });
          doc.moveDown(0.5);
        }
      } else {
        doc
          .fontSize(12)
          .font("Helvetica")
          .text(`- ${label}: Not uploaded or file missing`, { color: "gray" });
        doc.moveDown(0.5);
      }
    };

    addDocumentToPDF("ID Document / Passport", app.passportFileUrl);
    addDocumentToPDF("Diploma", app.diplomaFileUrl);
    addDocumentToPDF("Official Translation", app.translationFileUrl);

    // Footer
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc
      .fontSize(10)
      .font("Helvetica")
      .text("Ausbildung Portal - Confidential Document", 50, doc.y + 10, {
        align: "center",
      });

    doc.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @desc    Delete an application
exports.deleteApplication = async (req, res) => {
    try {
        await Application.findByIdAndDelete(req.params.id);
        res.json({ message: 'Application deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a user (and their applications)
exports.deleteUser = async (req, res) => {
    try {
        // حذف تمام اپلیکیشن‌های مرتبط با این کاربر
        await Application.deleteMany({ userId: req.params.id });
        // حذف خود کاربر
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User and associated data deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};