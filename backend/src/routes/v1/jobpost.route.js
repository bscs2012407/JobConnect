const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const postValidation = require('../../validations/jobpost.validation');
const postController = require('../../controllers/jobpost.controller');
const router = express.Router();

// Create Job Postrouter
router
  .route('/')
  .post(auth(), validate(postValidation.createJobPost), postController.createJobPost)
  .get(auth(), postController.getJobPosts);

router.route('/getAllJobs').get(postController.getAllJobPosts);
router.route('/jobs-history').get(auth(), postController.getJobsHistory);

router
  .route('/:jobId')
  .get(auth(), validate(postValidation.getJobPost), postController.getJobPostById)
  .put(auth(), validate(postValidation.updateJobPost), postController.updateJobPost)
  .delete(auth(), validate(postValidation.getJobPost), postController.deleteJobPost);

router.post('/:jobId/apply', auth(), validate(postValidation.applyJob), postController.applyForJob);
module.exports = router;
