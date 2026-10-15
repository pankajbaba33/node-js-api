const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper to generate JWT Token
const generateToken = (userId, email) => {
  return jwt.sign(
    { id: userId, email },
    process.env.JWT_SECRET || 'hirehub_default_secret_key',
    { expiresIn: '7d' }
  );
};

/**
 * Service: Register Candidate
 * Handles validation, duplicate check, password hashing, resume formatting, and DB creation.
 */
exports.registerUser = async (userData, file) => {
  const { name, email, password, mobile, workStatus, city, sendWhatsApp } = userData;

  // 1. Field validation
  if (!name || !email || !password || !mobile) {
    const error = new Error('Name, email, password, and mobile number are required.');
    error.statusCode = 400;
    throw error;
  }

  // 2. Check if user already exists
  const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
  if (existingUser) {
    const error = new Error('An account with this email address already exists. Please log in.');
    error.statusCode = 409;
    throw error;
  }

  // 3. Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // 4. Process Resume file if uploaded
  let resumeData = {
    filename: null,
    originalName: null,
    path: null,
    size: 0,
    uploadedAt: null,
  };

  if (file) {
    resumeData = {
      filename: file.filename,
      originalName: file.originalname,
      path: `/uploads/resumes/${file.filename}`,
      size: file.size,
      uploadedAt: new Date(),
    };
  }

  // 5. Create User document in MongoDB
  const newUser = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password: hashedPassword,
    mobile: mobile.trim(),
    workStatus: workStatus || 'experienced',
    city: city ? city.trim() : '',
    resume: resumeData,
    sendWhatsApp: sendWhatsApp === 'true' || sendWhatsApp === true,
  });

  // 6. Generate Token
  const token = generateToken(newUser._id, newUser.email);

  return {
    token,
    user: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      mobile: newUser.mobile,
      workStatus: newUser.workStatus,
      city: newUser.city,
      resume: newUser.resume,
      sendWhatsApp: newUser.sendWhatsApp,
    },
  };
};

/**
 * Service: Candidate Login
 * Verifies email/mobile and compares hashed password.
 */
exports.loginUser = async (identifier, password) => {
  const loginIdentifier = (identifier || '').trim();

  if (!loginIdentifier || !password) {
    const error = new Error('Please provide both your registered email/mobile and password.');
    error.statusCode = 400;
    throw error;
  }

  // Find user by email or mobile
  const user = await User.findOne({
    $or: [
      { email: loginIdentifier.toLowerCase() },
      { mobile: loginIdentifier },
    ],
  });

  if (!user) {
    const error = new Error('Invalid email/mobile or password.');
    error.statusCode = 401;
    throw error;
  }

  // Compare Password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error('Invalid email/mobile or password.');
    error.statusCode = 401;
    throw error;
  }

  // Generate Token
  const token = generateToken(user._id, user.email);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      workStatus: user.workStatus,
      city: user.city,
      resume: user.resume,
    },
  };
};

/**
 * Service: Upload or Update Resume
 */
exports.uploadResumeService = async (userId, file) => {
  if (!file) {
    const error = new Error('No resume file provided. Please choose a PDF or DOCX file.');
    error.statusCode = 400;
    throw error;
  }

  const resumeData = {
    filename: file.filename,
    originalName: file.originalname,
    path: `/uploads/resumes/${file.filename}`,
    size: file.size,
    uploadedAt: new Date(),
  };

  if (userId) {
    await User.findByIdAndUpdate(userId, { resume: resumeData });
  }

  return resumeData;
};
