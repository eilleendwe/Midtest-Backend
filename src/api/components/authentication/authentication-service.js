const authenticationRepository = require('./authentication-repository');
const { generateToken } = require('../../../utils/session-token');
const { passwordMatched } = require('../../../utils/password');

const wrongLoginAttempts = {};
const waktuAttempt = {};

/**
 * Check username and password for login.
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {object} An object containing, among others, the JWT token if the email and password are matched. Otherwise returns null.
 */
async function checkLoginCredentials(email, password) {
  const user = await authenticationRepository.getUserByEmail(email);

  // We define default user password here as '<RANDOM_PASSWORD_FILTER>'
  // to handle the case when the user login is invalid. We still want to
  // check the password anyway, so that it prevents the attacker in
  // guessing login credentials by looking at the processing time.
  const userPassword = user ? user.password : '<RANDOM_PASSWORD_FILLER>';
  const passwordChecked = await passwordMatched(password, userPassword);

  if (!user) {
    return {
      message: 'Email tidak terdaftar di dalam database',
    };
  }

  if (!passwordChecked) {
    if (!wrongLoginAttempts[email]) {
      wrongLoginAttempts[email] = 1;
    } else {
      wrongLoginAttempts[email]++;
      if (wrongLoginAttempts[email] > 5) {
        // -----------------------------
        const lastAttemptTime = waktuAttempt[email];
        if (lastAttemptTime && Date.now() - lastAttemptTime < 1800000) {
          const waktu = new Date();
          return {
            message: `[${waktu.toLocaleTimeString()}] Too many failed attempts. Try again in 30 minutes. At ${new Date(lastAttemptTime + 1800000).toLocaleTimeString()}`,
          };
        }
        wrongLoginAttempts[email] = 1;
      }
      waktuAttempt[email] = Date.now();
    }
  } else {
    wrongLoginAttempts[email] = 0;
    // mengecek apakah user ada pernah login tetapi memasukkan password yang benar selama masa 30 menit saat akun di kunci.
    const lastSuccessfulLoginTime = waktuAttempt[email];
    if (
      lastSuccessfulLoginTime &&
      Date.now() - lastSuccessfulLoginTime < 1800000
    ) {
      return {
        message: 'You are still locked out. Please try again later.',
      };
    }
  }

  // Because we always check the password (see above comment), we define the
  // login attempt as successful when the `user` is found (by email) and
  // the password matches.
  if (user && passwordChecked) {
    wrongLoginAttempts[email] = 0;
    //---------------
    waktuAttempt[email] = null;
    return {
      email: user.email,
      name: user.name,
      user_id: user.id,
      token: generateToken(user.email, user.id),
    };
  }

  return null;
}

module.exports = {
  checkLoginCredentials,
  wrongLoginAttempts,
};
