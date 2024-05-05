const mongoose = require('mongoose');
const config = require('../core/config');
const logger = require('../core/logger')('app');

const usersSchema = require('./users-schema');
const productsSchema = require('./products-schema');
const customersSchema = require('./customers-schema');
const ordersSchema = require('./orders-schema');
const failedAttemptsSchema = require('./failed-attempt-schema');

mongoose.connect(`${config.database.connection}/${config.database.name}`, {
  useNewUrlParser: true,
});

const db = mongoose.connection;
db.once('open', () => {
  logger.info('Successfully connected to MongoDB');
});

const User = mongoose.model('users', mongoose.Schema(usersSchema));
const failedAttempt = mongoose.model(
  'failedAttempts',
  mongoose.Schema(failedAttemptsSchema)
);

const Product = mongoose.model('products', mongoose.Schema(productsSchema));
const Customer = mongoose.model('customers', mongoose.Schema(customersSchema));
const Order = mongoose.model('orders', mongoose.Schema(ordersSchema));

module.exports = {
  mongoose,
  User,
  failedAttempt,
  Product,
  Customer,
  Order,
};
