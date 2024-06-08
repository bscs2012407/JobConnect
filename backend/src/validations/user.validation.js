const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
    role: Joi.string().required().valid('user', 'admin'),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId), // Assuming objectId is a custom validation function
  }),
  body: Joi.object().keys({
    name: Joi.string().optional(),
    email: Joi.string().email().optional(),
    phoneNumber: Joi.string().optional(),
    location: Joi.string().optional(),
    address: Joi.string().optional(),
    summary: Joi.string().optional(),
    technicalSkills: Joi.array().items(Joi.string()).optional(),
    softSkills: Joi.array().items(Joi.string()).optional(),
    certifications: Joi.array()
      .items(
        Joi.object().keys({
          title: Joi.string().optional(),
          issuingOrg: Joi.string().optional(),
          dateObtained: Joi.date().optional(),
        })
      )
      .optional(),
    projects: Joi.array()
      .items(
        Joi.object().keys({
          title: Joi.string().optional(),
          description: Joi.string().optional(),
          role: Joi.string().optional(),
        })
      )
      .optional(),
  }),
};

const updateUserFields = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      address: Joi.string(),
      phoneNumber: Joi.string(),
      firstName: Joi.string(),
      lastName: Joi.string(),
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateCompanyProfile = {
  body: Joi.object().keys({
    name: Joi.string(),
    industry: Joi.string(),
    location: Joi.string(),
    country: Joi.string(),
    state: Joi.string(),
    companySize: Joi.string(),
  }),
};

const updateCandidateProfile = {
  body: Joi.object().keys({
    skills: Joi.array().items(Joi.string()),
    portfolio: Joi.string(),
  }),
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  updateUserFields,
  updateCandidateProfile,
  updateCompanyProfile,
};
