const Application = require("../models/Application");

// @route   POST /api/applications
// @desc    Submit the 5-step Ausbildung application
exports.createApplication = async (req, res) => {
  try {
    const files = req.files; // Populated by Multer middleware

    // Map uploaded files to URLs
    const fileUrls = {
      passportFileUrl: files.passport
        ? `/uploads/passports/${files.passport[0].filename}`
        : null,
      diplomaFileUrl: files.diploma
        ? `/uploads/diplomas/${files.diploma[0].filename}`
        : null,
      translationFileUrl: files.translation
        ? `/uploads/certificates/${files.translation[0].filename}`
        : null,
    };

    // Combine text data from the 5 steps with file URLs and User ID
    const applicationData = {
      userId: req.user.id, // Injected by authMiddleware
      ...req.body, // Contains all fields from Step 1 to 4
      ...fileUrls,
    };

    const application = await Application.create(applicationData);

    res.status(201).json({
      success: true,
      message: "Application submitted successfully!",
      data: application,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   GET /api/applications/my
// @desc    Get logged-in user's applications
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res
      .status(200)
      .json({ success: true, count: applications.length, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
