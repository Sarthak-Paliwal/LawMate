const authService = require('../services/authService');
const { uploadToCloudinary } = require('../config/cloudinaryConfig');

/* -------------------- Register -------------------- */

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, barCouncilId, enrollmentYear, stateBarCouncil } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        status: "fail",
        message: "All required fields must be provided"
      });
    }

    const result = await authService.register({ 
      name, email, password, role, phone, barCouncilId, enrollmentYear, stateBarCouncil 
    });

    res.status(201).json({
      status: "success",
      data: result
    });

  } catch (err) {
    next(err);
  }
};

/* -------------------- Login -------------------- */

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Email and password are required"
      });
    }

    const result = await authService.login(email, password);

    res.status(200).json({
      status: "success",
      data: result
    });

  } catch (err) {
    next(err);
  }
};

/* -------------------- Get Current User -------------------- */

exports.getMe = async (req, res, next) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        status: "fail",
        message: "Unauthorized access"
      });
    }

    const user = await authService.getMe(req.user._id);

    res.status(200).json({
      status: "success",
      data: user
    });

  } catch (err) {
    next(err);
  }
};

/* -------------------- Upload Profile Image -------------------- */

exports.uploadProfileImage = async (req, res, next) => {
  try {
    if (!req.file) {
      console.log("No file uploaded. req.file is undefined.");
      return res.status(400).json({
        status: "fail",
        message: "Please upload an image file"
      });
    }

    // Upload to Cloudinary
    const imageUrl = await uploadToCloudinary(req.file.buffer);

    // Save URL in database
    const user = await authService.updateProfileImage(req.user._id, imageUrl);

    res.status(200).json({
      status: "success",
      data: user
    });

  } catch (err) {
    console.log(err);
    next(err);
  }
};

/* -------------------- Upload ID Proof Document -------------------- */
exports.uploadIdProof = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: "fail",
        message: "Please upload an ID proof document"
      });
    }

    // Upload to Cloudinary in a specific folder
    const documentUrl = await uploadToCloudinary(req.file.buffer, 'lawmate/id-proofs');

    // Save URL in database
    const user = await authService.updateIdProof(req.user._id, documentUrl);

    res.status(200).json({
      status: "success",
      data: user
    });

  } catch (err) {
    console.log("ID Proof Upload Error: ", err);
    next(err);
  }
};
