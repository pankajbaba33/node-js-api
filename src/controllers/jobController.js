const mongoose = require("mongoose");
const Job = require("../models/Job");
const fakeJobs = require("../data/fakeJobs");

// Helper function to seed initial jobs into MongoDB if collection is empty
const ensureJobsSeeded = async () => {
  if (mongoose.connection.readyState !== 1) return;
  try {
    const count = await Job.countDocuments();
    if (count === 0) {
      await Job.insertMany(fakeJobs);
      console.log("Fake jobs seeded into MongoDB successfully.");
    }
  } catch (err) {
    console.warn("Could not seed jobs to MongoDB (using in-memory fallback):", err.message);
  }
};

// Filter helper for in-memory or fallback filtering
const filterInMemoryJobs = (jobs, { keyword, experience, location }) => {
  return jobs.filter((job) => {
    // 1. Keyword check (matches title, company, or skills)
    if (keyword && keyword.trim()) {
      const q = keyword.trim().toLowerCase();
      const inTitle = job.title.toLowerCase().includes(q);
      const inCompany = job.company.toLowerCase().includes(q);
      const inSkills = job.skills.some((s) => s.toLowerCase().includes(q));
      
      // Also handle loose terms like "front" -> "frontend", "back" -> "backend"
      const matchLoose = 
        (q.includes("front") && (job.title.toLowerCase().includes("front") || job.skills.some(s => s.toLowerCase().includes("front")))) ||
        (q.includes("back") && (job.title.toLowerCase().includes("back") || job.skills.some(s => s.toLowerCase().includes("back"))));

      if (!inTitle && !inCompany && !inSkills && !matchLoose) {
        return false;
      }
    }

    // 2. Experience check
    if (experience !== undefined && experience !== null && experience !== "") {
      const expNum = parseInt(experience, 10);
      if (!isNaN(expNum)) {
        // Match if experience fits in the range
        // For 6+, consider jobs requiring 5+ or with minExp <= 6
        if (expNum >= 6) {
          if (job.maxExp < 5) return false;
        } else {
          if (job.minExp > expNum || job.maxExp < expNum) {
            // Also allow if minExp is 0 and expNum is 1, etc.
            if (!(job.minExp <= expNum && job.maxExp >= expNum)) {
              return false;
            }
          }
        }
      }
    }

    // 3. Location check
    if (location && location.trim()) {
      const locQ = location.trim().toLowerCase();
      const inLoc = job.location.toLowerCase().includes(locQ);
      // Handle abbreviations like "benga" for "bengaluru", "delhi" for "delhi ncr"
      const matchLocLoose = 
        (locQ.startsWith("beng") && job.location.toLowerCase().includes("bengaluru")) ||
        (locQ.startsWith("noid") && job.location.toLowerCase().includes("noida")) ||
        (locQ.startsWith("delh") && job.location.toLowerCase().includes("delhi")) ||
        (locQ.startsWith("gur") && job.location.toLowerCase().includes("gurugram"));

      if (!inLoc && !matchLocLoose) {
        return false;
      }
    }

    return true;
  });
};

// Search Jobs API Controller
exports.searchJobs = async (req, res) => {
  try {
    const { keyword, experience, location } = req.query;

    // If MongoDB is connected, try database query
    if (mongoose.connection.readyState === 1) {
      try {
        await ensureJobsSeeded();

        let mongoQuery = {};

        if (keyword && keyword.trim()) {
          const regex = new RegExp(keyword.trim(), "i");
          mongoQuery.$or = [
            { title: regex },
            { company: regex },
            { skills: { $in: [regex] } },
          ];
        }

        if (location && location.trim()) {
          const locRegex = new RegExp(location.trim(), "i");
          mongoQuery.location = locRegex;
        }

        if (experience !== undefined && experience !== null && experience !== "") {
          const expNum = parseInt(experience, 10);
          if (!isNaN(expNum)) {
            if (expNum >= 6) {
              mongoQuery.maxExp = { $gte: 5 };
            } else {
              mongoQuery.minExp = { $lte: expNum };
              mongoQuery.maxExp = { $gte: expNum };
            }
          }
        }

        const jobs = await Job.find(mongoQuery).sort({ createdAt: -1 });

        if (jobs && jobs.length > 0) {
          return res.status(200).json({
            success: true,
            count: jobs.length,
            data: jobs,
            source: "database",
          });
        }
      } catch (dbErr) {
        console.warn("MongoDB search error, falling back to mock dataset:", dbErr.message);
      }
    }

    // In-memory fallback
    const filtered = filterInMemoryJobs(fakeJobs, { keyword, experience, location });
    return res.status(200).json({
      success: true,
      count: filtered.length,
      data: filtered,
      source: "mock_fallback",
    });
  } catch (error) {
    console.error("Error in searchJobs:", error);
    res.status(500).json({
      success: false,
      message: "Server error while searching jobs",
      error: error.message,
    });
  }
};

// Get All Jobs
exports.getAllJobs = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      await ensureJobsSeeded();
      const jobs = await Job.find().sort({ createdAt: -1 });
      if (jobs && jobs.length > 0) {
        return res.status(200).json({
          success: true,
          count: jobs.length,
          data: jobs,
        });
      }
    }

    return res.status(200).json({
      success: true,
      count: fakeJobs.length,
      data: fakeJobs,
    });
  } catch (error) {
    return res.status(200).json({
      success: true,
      count: fakeJobs.length,
      data: fakeJobs,
    });
  }
};

// Explicit Seed Endpoint
exports.seedJobs = async (req, res) => {
  try {
    await Job.deleteMany({});
    const created = await Job.insertMany(fakeJobs);
    return res.status(201).json({
      success: true,
      message: "Jobs seeded successfully",
      count: created.length,
      data: created,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Seeding failed",
      error: error.message,
    });
  }
};
