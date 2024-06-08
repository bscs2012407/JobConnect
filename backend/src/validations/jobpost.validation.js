const Joi = require('joi');

const createJobPost = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().required(),
    company: Joi.string().required(),
    location: Joi.string().required(),
    requirements: Joi.array().items(Joi.string()),
    skills: Joi.array().items(Joi.string()),
    employmentType: Joi.string().valid('Full-time', 'Part-time', 'Contract', 'Internship').default('Full-time'),
    salary: Joi.number(),
    contactEmail: Joi.string().required().email(),
  }),
};

const updateJobPost = {
  params: Joi.object({
    jobId: Joi.string().required(),
  }),
  body: Joi.object().keys({
    title: Joi.string(),
    description: Joi.string(),
    company: Joi.string(),
    location: Joi.string(),
    requirements: Joi.array().items(Joi.string()),
    skills: Joi.array().items(Joi.string()),
    employmentType: Joi.string().valid('Full-time', 'Part-time', 'Contract', 'Internship'),
    salary: Joi.number(),
    contactEmail: Joi.string().email(),
  }),
};

const getJobPost = {
  params: Joi.object({
    jobId: Joi.string().required(),
  }),
};

const applyJob = {
  params: Joi.object({
    jobId: Joi.string().required(),
  }),
};

module.exports = {
  createJobPost,
  updateJobPost,
  getJobPost,
  applyJob
};
