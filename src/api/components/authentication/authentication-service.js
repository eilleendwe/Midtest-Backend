const authenticationRepository = require('./authentication-repository');
const { generateToken } = require('../../../utils/session-token');
const { passwordMatched } = require('../../../utils/password');
const rateLimit = require('express-rate-limit');
const loginAttempts = {};

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

  // Update jumlah loginattempts untuk user yang sedang login tapi password/email salah
  if (!passwordChecked) {
    if (!loginAttempts[email]) {
      loginAttempts[email] = 1;
    } else {
      loginAttempts[email]++;
      if (loginAttempts[email] >= 5) {
        loginAttempts[email] = 1;
      }
    }
  }

  // Because we always check the password (see above comment), we define the
  // login attempt as successful when the `user` is found (by email) and
  // the password matches.
  if (user && passwordChecked) {
    loginAttempts[email] = 0;
    return {
      email: user.email,
      name: user.name,
      user_id: user.id,
      token: generateToken(user.email, user.id),
    };
  }

  return null;
}

const loginLimiter = rateLimit({
  windowMs: 60 * 1000, //60 detik
  limit: 5,
  legacyHeaders: true,
  keyGenerator: (req) => req.body.email,
  handler: (request, response) => {
    const date = new Date(request.rateLimit.resetTime);
    request.rateLimit.resetTime = date.toLocaleString();
    response.status(403).json({
      message: `User ${request.body.email} sudah mencapai batas max login. Coba lagi pada ${request.rateLimit.resetTime}`,
    });
  },
});

module.exports = {
  checkLoginCredentials,
  loginAttempts,
  loginLimiter,
};
