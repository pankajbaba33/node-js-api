const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const authController = require('../controllers/authController');

// 1. Register candidate (handles form fields + optional resume file in 'resume' field)
router.post('/register', upload.single('resume'), authController.register);

// 2. Candidate Login
router.post('/login', authController.login);

// 3. Separate dedicated Resume Upload route
router.post('/upload-resume', upload.single('resume'), authController.uploadResume);

module.exports = router;
