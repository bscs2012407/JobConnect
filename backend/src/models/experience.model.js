const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const experienceSchema = mongoose.Schema(
  {
    company: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    // Additional fields related to work experience can be added here
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
experienceSchema.plugin(toJSON);

/**
 * @typedef Experience
 */
const Experience = mongoose.model('Experience', experienceSchema);

module.exports = Experience;
