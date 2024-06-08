const Joi = require('joi');

const createExperience = {
  body: Joi.object().keys({
    company: Joi.string().required(),
    position: Joi.string().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date(),
    // Add other fields as needed
  }),
};

const updateExperience = {
  params: Joi.object({
    experienceId: Joi.string().required(),
  }),
  body: Joi.object().keys({
    company: Joi.string(),
    position: Joi.string(),
    startDate: Joi.date(),
    endDate: Joi.date(),
    // Add other fields as needed
  }),
};

const getExperience = {
  params: Joi.object({
    experienceId: Joi.string().required(),
  }),
};

module.exports = {
  createExperience,
  updateExperience,
  getExperience,
};
