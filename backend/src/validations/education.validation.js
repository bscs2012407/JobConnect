const Joi = require('joi');

const createEducation = {
  body: Joi.object().keys({
    school: Joi.string().required(),
    degree: Joi.string().required(),
    fieldOfStudy: Joi.string(),
    graduationYear: Joi.number(),
    // Add other fields as needed
  }),
};

const updateEducation = {
  params: Joi.object({
    educationId: Joi.string().required(),
  }),
  body: Joi.object().keys({
    school: Joi.string(),
    degree: Joi.string(),
    fieldOfStudy: Joi.string(),
    graduationYear: Joi.number(),
    // Add other fields as needed
  }),
};

const getEducation = {
  params: Joi.object({
    educationId: Joi.string().required(),
  }),
};

module.exports = {
  createEducation,
  updateEducation,
  getEducation,
};
