const advocateService = require('../services/advocateService');

/* -------------------- List Advocates -------------------- */

exports.list = async (req, res, next) => {
  try {
    const { specialization, minExperience, available, sortBy } = req.query;

    const advocates = await advocateService.list({
      specialization,
      minExperience,
      available,
      sortBy
    });

    res.status(200).json({
      status: "success",
      results: advocates.length,
      data: advocates
    });

  } catch (err) {
    next(err);
  }
};

/* -------------------- Get My Advocate Profile -------------------- */

exports.getMyProfile = async (req, res, next) => {
  try {
    if (req.user.role !== 'advocate') {
      return res.status(403).json({
        status: "fail",
        message: "Only advocates can access profile"
      });
    }

    const profile = await advocateService.getProfile(req.user._id);

    res.status(200).json({
      status: "success",
      data: profile
    });

  } catch (err) {
    next(err);
  }
};

/* -------------------- Update Advocate Profile -------------------- */

exports.updateProfile = async (req, res, next) => {
  try {
    if (req.user.role !== 'advocate') {
      return res.status(403).json({
        status: "fail",
        message: "Only advocates can update profile"
      });
    }

    const profile = await advocateService.upsertProfile(
      req.user._id,
      req.body
    );

    res.status(200).json({
      status: "success",
      data: profile
    });

  } catch (err) {
    next(err);
  }
};

/* -------------------- Upload Profile Picture -------------------- */

exports.uploadProfilePicture = async (req, res, next) => {
  try {
    if (req.user.role !== 'advocate') {
      return res.status(403).json({
        status: "fail",
        message: "Only advocates can update their profile picture"
      });
    }

    if (!req.file) {
      return res.status(400).json({
        status: "fail",
        message: "No image file provided"
      });
    }

    // Convert buffer to Base64 data URL
    const base64 = req.file.buffer.toString('base64');
    const dataUrl = `data:${req.file.mimetype};base64,${base64}`;

    const profile = await advocateService.updateProfilePicture(req.user._id, dataUrl);

    res.status(200).json({
      status: "success",
      data: { profilePicture: profile.profilePicture }
    });

  } catch (err) {
    next(err);
  }
};
