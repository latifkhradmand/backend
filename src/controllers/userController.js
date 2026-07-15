const User = require("../models/User");

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password -verificationCode -verificationCodeExpires",
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: req.body },
      { new: true, runValidators: true },
    ).select("-password -verificationCode -verificationCodeExpires");

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
