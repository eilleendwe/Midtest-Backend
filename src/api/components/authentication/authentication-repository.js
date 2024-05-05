const { User, failedAttempt } = require('../../../models');
const lockedTime = 60 * 1000; // 1 menit
/**
 * Get user by email for login information
 * @param {string} email - Email
 * @returns {Promise}
 */
async function getUserByEmail(email) {
  return User.findOne({ email });
}

async function getFailedLoginAttempts(email) {
  return failedAttempt.findOne({ email });
}

async function resetFailedAttempts(email) {
  await failedAttempt.findOneAndUpdate(
    { email }, //kriteria cari
    { $set: { failedAttempt: 0, timeAttempt: null } }, // Update document
    { upsert: true } // options
  );
}

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
