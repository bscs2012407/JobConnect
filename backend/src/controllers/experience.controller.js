const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { Experience } = require('../models');
const mongoose = require('mongoose');

const createExperience = catchAsync(async (req, res) => {
  const experience = await Experience.create({ ...req.body, user: req.user._id });
  // Add the experience reference to the user's experiences array
  req.user.experiences.push(experience._id);
  await req.user.save();
  res.status(httpStatus.CREATED).json(experience);
});

const getExperiences = catchAsync(async (req, res) => {
  // Populate the experiences field to get the full experience documents
  await req.user.populate('experiences').execPopulate();
  res.json(req.user.experiences);
});

const getExperienceById = catchAsync(async (req, res) => {
  const { experienceId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(experienceId)) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: 'Invalid ObjectId' });
  }
  const experience = await Experience.findById(experienceId);
  if (!experience) {
    return res.status(httpStatus.NOT_FOUND).json({ message: 'Experience not found' });
  }
  res.json(experience);
});

const updateExperience = catchAsync(async (req, res) => {
  const { experienceId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(experienceId)) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: 'Invalid ObjectId' });
  }
  const experience = await Experience.findByIdAndUpdate(experienceId, req.body, { new: true });
  if (!experience) {
    return res.status(httpStatus.NOT_FOUND).json({ message: 'Experience not found' });
  }
  res.json(experience);
});

const deleteExperience = catchAsync(async (req, res) => {
  const { experienceId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(experienceId)) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: 'Invalid ObjectId' });
  }
  // Remove the experience reference from the user's experiences array
  req.user.experiences.pull(experienceId);
  await req.user.save();

  const experience = await Experience.findByIdAndDelete(experienceId);
  if (!experience) {
    return res.status(httpStatus.NOT_FOUND).json({ message: 'Experience not found' });
  }
  res.json({ message: 'Experience deleted successfully' });
});

module.exports = {
  createExperience,
  getExperiences,
  getExperienceById,
  updateExperience,
  deleteExperience,
};
