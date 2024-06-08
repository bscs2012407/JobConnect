const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
      private: true,
    },
    role: {
      type: String,
      enum: roles,
      default: 'user',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    educations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Education' }],
    experiences: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Experience' }],
    technicalSkills: {
      type: [String],
      default: [],
    },
    softSkills: {
      type: [String],
      default: [],
    },
    certifications: {
      type: [
        {
          title: {
            type: String,
          },
          issuingOrg: {
            type: String,
          },
          dateObtained: {
            type: Date,
          },
        },
      ],
      default: [],
    },
    projects: {
      type: [
        {
          title: {
            type: String,
          },
          description: {
            type: String,
          },
          role: {
            type: String,
          },
        },
      ],
      default: [],
    },
    portfolio: {
      type: String,
      default: '',
    },
    summary: {
      type: String,
      default: '',
    },
    // company profile fields
    industry: {
      type: String,
      default: '',
    },
    country: {
      type: String,
      default: 'Pakistan',
    },
    state: {
      type: String,
      default: 'Sindh',
    },
    companySize: {
      type: String,
      default: '',
    },
    companyName: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);
// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

/**
 * @typedef User
 */
const User = mongoose.model('User', userSchema);

module.exports = User;
