const authService = require('../services/authService');

// @desc    Register a new candidate (with optional resume upload)
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const result = await authService.registerUser(req.body, req.file);

    return res.status(201).json({
      success: true,
      message: 'Candidate registered successfully!',
      ...result,
    });
  } catch (error) {
    console.error('Registration Controller Error:', error.message);
    const status = error.statusCode || 500;
    return res.status(status).json({
      success: false,
      message: error.message || 'Server error during registration.',
    });
  }
};

// @desc    Candidate Login
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { identifier, email, password } = req.body;
    const loginIdentifier = identifier || email;

    const result = await authService.loginUser(loginIdentifier, password);

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully!',
      ...result,
    });
  } catch (error) {
    console.error('Login Controller Error:', error.message);
    const status = error.statusCode || 500;
    return res.status(status).json({
      success: false,
      message: error.message || 'Server error during login.',
    });
  }
};

// @desc    Separate dedicated Resume Upload endpoint
// @route   POST /api/auth/upload-resume
// @access  Public / Protected
exports.uploadResume = async (req, res) => {
  try {
    const resumeData = await authService.uploadResumeService(req.body.userId, req.file);

    return res.status(200).json({
      success: true,
      message: 'Resume uploaded successfully!',
      resume: resumeData,
    });
  } catch (error) {
    console.error('Resume Upload Controller Error:', error.message);
    const status = error.statusCode || 500;
    return res.status(status).json({
      success: false,
      message: error.message || 'Error uploading resume.',
    });
  }
};
