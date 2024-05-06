const { User, failedAttempt } = require('../../../models');
const lockedTime = 30 * 60 * 1000; // 30 menit
/**
 * Get user by email for login information
 * @param {string} email - Email
 * @returns {Promise}
 */
async function getUserByEmail(email) {
  return User.findOne({ email });
}

/**
 * Get failed login attempt untuk setiap email
 * @param {string} email - Email
 * @returns {Promise}
 */
async function getFailedLoginAttempts(email) {
  return failedAttempt.findOne({ email });
}

/**
 * Untuk mereset failed attempt per user
 * @param {string} email - Email
 * @returns {Promise}
 */
async function resetFailedAttempts(email) {
  await failedAttempt.findOneAndUpdate(
    { email }, //kriteria cari
    { $set: { failedAttempt: 0, timeAttempt: null } }, // Update document
    { upsert: true } // options
  );
}

/**
 * Untuk mengupdate failed attempt per user
 * @param {string} email - Email
 * @returns {Promise}
 */
async function updateFailedAttempts(email) {
  await failedAttempt.findOneAndUpdate(
    { email },
    {
      $inc: { failedAttempt: 1 },
      $set: { timeAttempt: new Date() },
    },
    //kalau gada maka buat baru
    //return yang sudah di update
    { upsert: true, new: true }
  );
}

/**
 * Untuk mengecek apakah account masih kekunci dalam batas waktu atau tidak
 * @param {string} email - Email
 * @returns {boolean}
 */
async function isAccountLocked(email) {
  const attempt = await failedAttempt.findOne({ email });
  if (attempt && attempt.failedAttempt > 5) {
    const currentTime = new Date().getTime();
    const timeDifference = currentTime - attempt.timeAttempt.getTime();
    if (timeDifference < lockedTime) {
      return true; // Akun terkunci
    }
  }
  return false; // Akun tidak terkunci atau tidak ada percobaan gagal sebelumnya
}

module.exports = {
  getUserByEmail,
  resetFailedAttempts,
  updateFailedAttempts,
  getFailedLoginAttempts,
  isAccountLocked,
};
