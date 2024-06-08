const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');
const { JobPost } = require('../models');

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const getAnalytics = catchAsync(async (req, res) => {
  let payload;
  // Helper function to initialize a week structure
  const initWeekData = () => ({
    Sunday: 0,
    Monday: 0,
    Tuesday: 0,
    Wednesday: 0,
    Thursday: 0,
    Friday: 0,
    Saturday: 0,
  });
  if (req.user.role === 'company') {
    const jobPosts = await JobPost.find({ postedBy: req.user.id }).populate('appplications', 'createdAt');
    let applicantsCount = 0;
    const weekData = initWeekData();

    jobPosts.forEach((jobPost) => {
      applicantsCount += jobPost.appplications.length;
      jobPost.appplications.forEach((application) => {
        const dayOfWeek = new Date(application.createdAt).toLocaleString('en-US', { weekday: 'long' });
        weekData[dayOfWeek] += 1;
      });
    });

    const graphData = Object.keys(weekData).map((day) => ({
      name: day,
      Applicants: weekData[day],
    }));

    payload = {
      jobPostsCount: jobPosts.length,
      applicantsCount,
      graphData,
    };
  } else if (req.user.role === 'user') {
    const allJobPosts = await JobPost.find({}).populate('appplications');
    let jobsAppliedCount = 0;
    const weekData = initWeekData();

    allJobPosts.forEach((jobPost) => {
      jobPost.appplications.forEach((application) => {
        if (application._id.toString() === req.user.id) {
          jobsAppliedCount += 1;
          const dayOfWeek = new Date(application.createdAt).toLocaleString('en-US', { weekday: 'long' });
          weekData[dayOfWeek] += 1;
        }
      });
    });

    const graphData = Object.keys(weekData).map((day) => ({
      name: day,
      Applications: weekData[day],
    }));

    payload = {
      jobPostsCount: allJobPosts.length,
      jobsAppliedCount,
      graphData,
    };
  }
  res.send(payload);
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getSignedUrlForUploadFile = catchAsync(async (req, res) => {
  const { fileType } = req.query;

  // Generate a random UID for the file name
  const fileName = `${uuidv4()}.${fileType.split('/').pop()}`;

  console.log(fileName, fileType);

  const params = {
    Bucket: 'asktumi',
    Key: fileName,
    ContentType: fileType,
    Expires: 180, // URL expiration time in seconds
  };

  // Generate the pre-signed URL
  s3.getSignedUrl('putObject', params, (err, url) => {
    if (err) {
      console.error('Error generating pre-signed URL:', err);
      res.status(500).json({ error: 'Failed to generate pre-signed URL' });
    } else {
      res.json({ url });
    }
  });
});

const updateCompanyDetails = catchAsync(async (req, res) => {
  // Check if the user has the "company" role
  if (req.user.role !== 'company') {
    return res.status(httpStatus.FORBIDDEN).json({ message: 'Access denied. Only companies can update these details.' });
  }
  const { name, industry, location, country, state, companySize } = req.body;
  if (name !== undefined && name !== null) {
    req.user.name = name;
  }
  if (industry !== undefined && industry !== null) {
    req.user.industry = industry;
  }
  if (location !== undefined && location !== null) {
    req.user.location = location;
  }
  if (country !== undefined && country !== null) {
    req.user.country = country;
  }
  if (state !== undefined && state !== null) {
    req.user.state = state;
  }
  if (companySize !== undefined && companySize !== null) {
    req.user.companySize = companySize;
  }
  await req.user.save();
  res.status(httpStatus.OK).json(req.user);
});

const updateCandidateDetails = catchAsync(async (req, res) => {
  if (req.user.role !== 'user') {
    return res.status(httpStatus.FORBIDDEN).json({ message: 'Access denied. Only regular users can update these details.' });
  }
  const { skills, portfolio } = req.body;
  if (skills !== undefined && skills !== null) {
    req.user.skills = skills;
  }
  if (portfolio !== undefined && portfolio !== null) {
    req.user.portfolio = portfolio;
  }
  await req.user.save();
  res.status(httpStatus.OK).json(req.user);
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getSignedUrlForUploadFile,
  updateCandidateDetails,
  updateCompanyDetails,
  getAnalytics,
};
