const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const educationSchema = mongoose.Schema(
  {
    school: {
      type: String,
      required: true,
    },
    degree: {
      type: String,
      required: true,
    },
    fieldOfStudy: {
      type: String,
    },
    graduationYear: {
      type: Number,
    },
    // Additional fields related to education can be added here
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
educationSchema.plugin(toJSON);

/**
 * @typedef Education
 */
const Education = mongoose.model('Education', educationSchema);

module.exports = Education;
