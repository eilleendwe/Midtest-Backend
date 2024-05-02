const authenticationRepository = require('./authentication-repository');
const { generateToken } = require('../../../utils/session-token');
const { passwordMatched } = require('../../../utils/password');

const wrongLoginAttempts = {};
let waktuAttempt = {};

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
      if (wrongLoginAttempts[email] > 3) {
        // -----------------------------
        const lastAttemptTime = waktuAttempt[email];
        if (lastAttemptTime && Date.now() - lastAttemptTime < 60000) {
          return {
            message: `Too many failed attempts. Try again in 1 minute. At ${new Date(lastAttemptTime + 60000).toLocaleTimeString()}`,
          };
        }
        wrongLoginAttempts[email] = 1;
      }
      waktuAttempt[email] = Date.now();
    }
  } else {
    wrongLoginAttempts[email] = 0;
    //---------------
    waktuAttempt[email] = null;
  }

  // Because we always check the password (see above comment), we define the
  // login attempt as successful when the `user` is found (by email) and
  // the password matches.
  if (user && passwordChecked) {
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
