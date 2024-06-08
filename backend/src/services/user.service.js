const httpStatus = require('http-status');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return User.create(userBody);
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findById(id);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  let user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  user = await User.findOneAndUpdate(
    { _id: userId },
    {
      $set: updateBody,
    },
    { new: true }
  );
  return user;
  // Specific flow for the add new password
  // if (patternType == 'updateUser') {
  //   if (updateBody.password && !updateBody.previousPassword) {
  //     throw new ApiError(httpStatus.BAD_REQUEST, 'Please enter previous password feild');
  //   }
  //   if (updateBody.password && (await user.isPasswordMatch(updateBody.password))) {
  //     throw new ApiError(httpStatus.BAD_REQUEST, 'Please enter a new password');
  //   }
  //   if (updateBody.password && !(await user.isPasswordMatch(updateBody.previousPassword))) {
  //     throw new ApiError(httpStatus.BAD_REQUEST, 'Incorrect previous password');
  //   }
  //   Object.assign(user, updateBody);
  //   await user.save();
  //   return user;
  // } else {
  //   console.log('normal update');
  //   if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
  //     throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  //   }
  //   Object.assign(user, updateBody);
  //   await user.save();
  //   return user;
  // }
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

/**
 * update user by query
 * @param {ObjectId} userId
 */
const updateUserByQuery = async (userId, query) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  console.log(
    await user.updateOne(
      {
        _id: user._id,
      },
      query
    )
  );
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  updateUserByQuery,
};
