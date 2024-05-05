const authenticationRepository = require('./authentication-repository');
const { generateToken } = require('../../../utils/session-token');
const { passwordMatched } = require('../../../utils/password');

const lockedTime = 60 * 1000;
let lastFailedAttepmptTime;

/**
 * Check username and password for login.
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {object} An object containing, among others, the JWT token if the email and password are matched. Otherwise returns null.
 */
async function checkLoginCredentials(email, password) {
  //cek apakah akun masih ke lock apa sudah melewati 30 menit
  const isLocked = await authenticationRepository.isAccountLocked(email);
  if (isLocked) {
    return {
      message: 'LOCKED',
      success: false,
    };
  }

  const user = await authenticationRepository.getUserByEmail(email);

  if (!user) {
    return {
      message: 'Email tidak terdaftar',
    };
  }

  // We define default user password here as '<RANDOM_PASSWORD_FILTER>'
  // to handle the case when the user login is invalid. We still want to
  // check the password anyway, so that it prevents the attacker in
  // guessing login credentials by looking at the processing time.
  const userPassword = user ? user.password : '<RANDOM_PASSWORD_FILLER>';
  const passwordChecked = await passwordMatched(password, userPassword);

  // Because we always check the password (see above comment), we define the
  // login attempt as successful when the `user` is found (by email) and
  // the password matches.
  if (user && passwordChecked) {
    //kalau berhasil login reset failed attempt
    await authenticationRepository.resetFailedAttempts(email);
    return {
      message: 'Berhasil login',
      email: user.email,
      name: user.name,
      user_id: user.id,
      token: generateToken(user.email, user.id),
    };
  } else {
    await authenticationRepository.updateFailedAttempts(email);
    let jumlahAttempt =
      await authenticationRepository.getFailedLoginAttempts(email);

    if (jumlahAttempt.failedAttempt > 5) {
      if (jumlahAttempt.failedAttempt == 6) {
        lastFailedAttepmptTime = jumlahAttempt.timeAttempt.getTime();
      }
      const currentTime = new Date().getTime();
      const timeDifference = currentTime - lastFailedAttepmptTime;
      if (timeDifference < lockedTime) {
        // Jika melewati max failed login attempt maka akan ke lock
        const unlockTime = new Date(lastFailedAttepmptTime + lockedTime);
        return {
          message: `Too many failed attempts. Try again in 30 minutes at ${unlockTime.toLocaleTimeString()}`,
        };
      } else {
        // jika sudah melewati 30 menit maka failedAttempt akan kereset
        jumlahAttempt =
          await authenticationRepository.getFailedLoginAttempts(email);
        if (jumlahAttempt.failedAttempt > 5) {
          await authenticationRepository.resetFailedAttempts(email);
          await authenticationRepository.updateFailedAttempts(email);
        }
        jumlahAttempt =
          await authenticationRepository.getFailedLoginAttempts(email);
        return {
          message: jumlahAttempt.failedAttempt,
          success: false,
        };
      }
    } else {
      return { message: jumlahAttempt.failedAttempt, success: false };
    }
  }
}

module.exports = {
  checkLoginCredentials,
};
