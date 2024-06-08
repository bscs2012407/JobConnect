const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { JobPost, User } = require('../models');
const mongoose = require('mongoose');

const createJobPost = catchAsync(async (req, res) => {
  const jobPost = await JobPost.create({ ...req.body, postedBy: req.user._id });
  res.status(httpStatus.CREATED).json(jobPost);
});

const getJobPosts = catchAsync(async (req, res) => {
  let payload = [];
  if (req.user.role === 'user') {
    payload = await JobPost.find().populate('postedBy').sort({ createdAt: -1 });
  } else if (req.user.role === 'company') {
    const jobPosts = await JobPost.find({ postedBy: req.user._id }).populate('postedBy').sort({ createdAt: -1 });
    payload = await Promise.all(
      jobPosts.map(async (jobPost) => {
        const applicants = await Promise.all(
          jobPost.appplications.map(async (applicationId) => {
            const user = await User.findById(applicationId).select('name email phoneNumber profilePicture location');
            return { ...user.toObject() };
          })
        );
        return { ...jobPost.toObject(), applicants };
      })
    );
  }
  res.json(payload);
});

const getAllJobPosts = catchAsync(async (req, res) => {
  const payload = await JobPost.find().populate('postedBy').sort({ createdAt: -1 });
  res.json(payload);
});

const getJobsHistory = catchAsync(async (req, res) => {
  let payload;
  if (req.user.role === 'company') {
    const jobPosts = await JobPost.find({ postedBy: req.user._id }).populate('postedBy').sort({ createdAt: -1 });
    payload = await Promise.all(
      jobPosts.map(async (jobPost) => {
        const applicants = await Promise.all(
          jobPost.appplications.map(async (applicationId) => {
            const user = await User.findById(applicationId).select('name email phoneNumber profilePicture location');
            return { ...user.toObject() };
          })
        );
        return { ...jobPost.toObject(), applicants };
      })
    );
  } else if (req.user.role === 'user') {
    const allJobs = await JobPost.find({}).populate('postedBy').sort({ createdAt: -1 });
    payload = allJobs.filter((jobPost) => jobPost.appplications.includes(req.user.id));
  }
  res.json(payload);
});

const getJobPostById = catchAsync(async (req, res) => {
  const { jobId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: 'Invalid ObjectId' });
  }
  const jobPost = await JobPost.findById(jobId);
  if (!jobPost) {
    return res.status(httpStatus.NOT_FOUND).json({ message: 'Job post not found' });
  }
  res.json(jobPost);
});

const updateJobPost = catchAsync(async (req, res) => {
  const { jobId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: 'Invalid ObjectId' });
  }
  const jobPost = await JobPost.findByIdAndUpdate(jobId, req.body, { new: true });
  if (!jobPost) {
    return res.status(httpStatus.NOT_FOUND).json({ message: 'Job post not found' });
  }
  res.json(jobPost);
});

const deleteJobPost = catchAsync(async (req, res) => {
  const { jobId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: 'Invalid ObjectId' });
  }
  const jobPost = await JobPost.findByIdAndDelete(jobId);
  if (!jobPost) {
    return res.status(httpStatus.NOT_FOUND).json({ message: 'Job post not found' });
  }
  res.json({ message: 'Job post deleted successfully' });
});

const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Check if jobId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(httpStatus.BAD_REQUEST).json({ message: 'Invalid ObjectId for job' });
    }

    // Check if the job post exists
    const jobPost = await JobPost.findById(jobId);
    if (!jobPost) {
      return res.status(httpStatus.NOT_FOUND).json({ message: 'Job post not found' });
    }
    console.log(jobPost);
    // Check if the user has already applied for the job
    const user = req.user; // Assuming you're using authentication middleware to set req.user
    const hasApplied = jobPost.appplications.includes(user._id);

    if (hasApplied) {
      return res.status(httpStatus.OK).json({ message: 'You have already applied for this job' });
    }

    // Add the user to the job post's applications array
    jobPost.appplications.push(user._id);
    await jobPost.save();

    // Add the job post to the user's appliedJobs array

    return res.status(httpStatus.CREATED).json({ message: 'Job application successful' });
  } catch (error) {
    console.error(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
  }
};
module.exports = {
  getJobPosts,
  getJobPostById,
  createJobPost,
  updateJobPost,
  deleteJobPost,
  applyForJob,
  getAllJobPosts,
  getJobsHistory,
};
