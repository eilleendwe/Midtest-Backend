const { errorResponder, errorTypes } = require('../../../core/errors');
const authenticationServices = require('./authentication-service');

/**
 * Handle login request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function login(request, response, next) {
  const { email, password } = request.body;

  try {
    // Check login credentials
    const loginSuccess = await authenticationServices.checkLoginCredentials(
      email,
      password
    );

    if (loginSuccess.success == false && loginSuccess.message === 'LOCKED') {
      return response.status(403).json({
        message: `Your account is still locked.`,
      });
    } else if (loginSuccess.success == false) {
      throw errorResponder(
        errorTypes.INVALID_CREDENTIALS,
        `Wrong email or password. Attempt ke ${loginSuccess.message}`
      );
    }
    return response.status(200).json(loginSuccess);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login,
};
