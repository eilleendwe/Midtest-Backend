const { User } = require('../../../models');

/**
 * Get a list of users
 * @returns {Promise}
 */
async function getUsers() {
  return User.find({});
}

/**
 * Menghitung berapa banyak user yang di search / yang dicari
 * @param {string} searchQuery - kata kunci yang dicari
 * @returns {Promise}
 */
async function searchedUsersCount(searchQuery) {
  return User.countDocuments(searchQuery);
}

/**
 * Mengandle list of users yang di search dan sort
 * @param {string} search - yang di cari (email/name)
 * @param {string} sort - jenis sort yg diinginkan (asc/desc)
 * @param {string} page_number - page ke berapa
 * @param {string} page_size - banyak data yang ada dalam 1 halaman
 * @returns {Promise}
 */
async function getUsersSearchSort(
  searchQuery,
  sortQuery,
  page_number,
  page_size
) {
  return User.find(searchQuery)
    .sort(sortQuery)
    .skip((page_number - 1) * page_size)
    .limit(page_size);
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function getUser(id) {
  return User.findById(id);
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Hashed password
 * @returns {Promise}
 */
async function createUser(name, email, password) {
  return User.create({
    name,
    email,
    password,
  });
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {Promise}
 */
async function updateUser(id, name, email) {
  return User.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        name,
        email,
      },
    }
  );
}

/**
 * Delete a user
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function deleteUser(id) {
  return User.deleteOne({ _id: id });
}

/**
 * Get user by email to prevent duplicate email
 * @param {string} email - Email
 * @returns {Promise}
 */
async function getUserByEmail(email) {
  return User.findOne({ email });
}

/**
 * Update user password
 * @param {string} id - User ID
 * @param {string} password - New hashed password
 * @returns {Promise}
 */
async function changePassword(id, password) {
  return User.updateOne({ _id: id }, { $set: { password } });
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserByEmail,
  changePassword,
  getUsersSearchSort,
  searchedUsersCount,
};
