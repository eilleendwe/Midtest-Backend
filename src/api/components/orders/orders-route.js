const express = require('express');

const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const ordersControllers = require('./orders-controller');

const route = express.Router();

module.exports = (app) => {
  app.use('/orders', route);

  // Get list of orders
  route.get('/', authenticationMiddleware, ordersControllers.getOrders);

  // Get order detail
  route.get('/:id', authenticationMiddleware, ordersControllers.getOrder);

  // Delete order
  route.delete('/:id', authenticationMiddleware, ordersControllers.deleteOrder);
};
