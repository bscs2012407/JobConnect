const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { User, Education } = require('../models');
const mongoose = require('mongoose');

const createEducation = catchAsync(async (req, res) => {
  const education = await Education.create({ ...req.body, user: req.user._id });
  // Add the education reference to the user's educations array
  req.user.educations.push(education._id);
  await req.user.save();
  res.status(httpStatus.CREATED).json(education);
});

const getEducations = catchAsync(async (req, res) => {
  // Populate the educations field to get the full education documents
  await req.user.populate('educations').execPopulate();
  res.json(req.user.educations);
});

const getEducationById = catchAsync(async (req, res) => {
  const { educationId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(educationId)) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: 'Invalid ObjectId' });
  }
  const education = await Education.findById(educationId);
  if (!education) {
    return res.status(httpStatus.NOT_FOUND).json({ message: 'Education not found' });
  }
  res.json(education);
});

const updateEducation = catchAsync(async (req, res) => {
  const { educationId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(educationId)) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: 'Invalid ObjectId' });
  }
  const education = await Education.findByIdAndUpdate(educationId, req.body, { new: true });
  if (!education) {
    return res.status(httpStatus.NOT_FOUND).json({ message: 'Education not found' });
  }
  res.json(education);
});

const deleteEducation = catchAsync(async (req, res) => {
  const { educationId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(educationId)) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: 'Invalid ObjectId' });
  }
  // Remove the education reference from the user's educations array
  req.user.educations.pull(educationId);
  await req.user.save();

  const education = await Education.findByIdAndDelete(educationId);
  if (!education) {
    return res.status(httpStatus.NOT_FOUND).json({ message: 'Education not found' });
  }
  res.json({ message: 'Education deleted successfully' });
});

module.exports = {
  createEducation,
  getEducations,
  getEducationById,
  updateEducation,
  deleteEducation,
};
