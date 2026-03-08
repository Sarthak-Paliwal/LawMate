const User = require('../models/User');

/* -------------------- Get Pending Advocates -------------------- */
exports.getPendingAdvocates = async (req, res, next) => {
  try {
    const pendingAdvocates = await User.find({
      role: 'advocate',
      isAdvocateVerified: false
    }).select('-password');

    res.status(200).json({
      status: 'success',
      results: pendingAdvocates.length,
      data: pendingAdvocates
    });
  } catch (err) {
    next(err);
  }
};

/* -------------------- Verify Advocate -------------------- */
exports.verifyAdvocate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'approve' or 'reject'

    const advocate = await User.findById(id);

    if (!advocate || advocate.role !== 'advocate') {
      return res.status(404).json({
        status: 'fail',
        message: 'Advocate not found'
      });
    }

    if (action === 'approve') {
      advocate.isAdvocateVerified = true;
      await advocate.save({ validateBeforeSave: false }); // Bypass password validation
      
      return res.status(200).json({
        status: 'success',
        message: 'Advocate has been verified successfully',
        data: advocate
      });
    } else if (action === 'reject') {
      // In a real app we might delete them or set a rejected status, but for now we'll just delete the user document
      await User.findByIdAndDelete(id);
      
      return res.status(200).json({
        status: 'success',
        message: 'Advocate application has been rejected and removed'
      });
    } else {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid action. Must be approve or reject'
      });
    }

  } catch (err) {
    next(err);
  }
};
