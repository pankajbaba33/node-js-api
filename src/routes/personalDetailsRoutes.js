const express = require('express');
const router = express.Router();
const personalDetailsController = require('../controllers/personalDetailsController');

// POST /api/personal-details - Submit Step 1 details
router.post('/', personalDetailsController.savePersonalDetails);

// GET /api/personal-details/:id - Fetch Step 1 details
router.get('/:id', personalDetailsController.getPersonalDetails);

module.exports = router;
