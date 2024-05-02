const express = require('express');

const authenticationControllers = require('./authentication-controller');
const authenticationValidators = require('./authentication-validator');
const celebrate = require('../../../core/celebrate-wrappers');

const route = express.Router();

const { loginLimiter } = require('../authentication/authentication-controller');

module.exports = (app) => {
  app.use('/authentication', route);
  // app.user(loginLimiter);

  route.post(
    '/login',
    celebrate(authenticationValidators.login),
    loginLimiter,
    authenticationControllers.login
  );
};
