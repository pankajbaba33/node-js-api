const personalDetailsService = require('../services/personalDetailsService');

// @desc    Submit Personal Details (Tell us about you)
// @route   POST /api/personal-details
// @access  Public
exports.savePersonalDetails = async (req, res) => {
  try {
    const data = await personalDetailsService.createPersonalDetails(req.body);

    return res.status(201).json({
      success: true,
      message: 'Personal details saved successfully!',
      data: {
        id: data._id,
        fullName: data.fullName,
        age: data.age,
        height: data.height,
        createdAt: data.createdAt,
      },
    });
  } catch (error) {
    console.error('Personal Details Controller Error:', error.message);
    const status = error.statusCode || 500;
    return res.status(status).json({
      success: false,
      message: error.message || 'Server error while saving personal details.',
    });
  }
};

// @desc    Get Personal Details by ID
// @route   GET /api/personal-details/:id
// @access  Public
exports.getPersonalDetails = async (req, res) => {
  try {
    const data = await personalDetailsService.getPersonalDetailsById(req.params.id);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json({
      success: false,
      message: error.message || 'Server error while fetching personal details.',
    });
  }
};
