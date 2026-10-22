const express = require("express");
const router = express.Router();
const { searchJobs, getAllJobs, seedJobs } = require("../controllers/jobController");

// Search jobs with query params ?keyword=...&experience=...&location=...
router.get("/search", searchJobs);

// Get all jobs
router.get("/", getAllJobs);

// Re-seed fake jobs
router.post("/seed", seedJobs);

module.exports = router;
