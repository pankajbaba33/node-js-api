const PersonalDetails = require('../models/PersonalDetails');

/**
 * Service: Save Personal Details
 * @param {Object} data - { fullName, age, height }
 */
exports.createPersonalDetails = async (data) => {
  const { fullName, age, height } = data;

  // 1. Validation
  if (!fullName || fullName.trim() === '') {
    const error = new Error('Full name is required.');
    error.statusCode = 400;
    throw error;
  }

  const parsedAge = Number(age);
  if (isNaN(parsedAge) || parsedAge < 1 || parsedAge > 120) {
    const error = new Error('Please enter a valid age between 1 and 120.');
    error.statusCode = 400;
    throw error;
  }

  if (!height || height.trim() === '') {
    const error = new Error('Heightesdv s required (e.g. 5\'6" or 168 cm).');
    error.statusCode = 400;
    throw error;
  }

  // 2. Create and Save Document in MongoDB
  const personalDetails = await PersonalDetails.create({
    fullName: fullName.trim(),
    age: parsedAge,
    height: height.trim(),
  });

  return personalDetails;
};

/**
 * Service: Get Personal Details by ID
 * @param {string} id
 */
exports.getPersonalDetailsById = async (id) => {
  const details = await PersonalDetails.findById(id);
  if (!details) {
    const error = new Error('Personal details not found.');
    error.statusCode = 404;
    throw error;
  }
  return details;
};
