const joi = require('joi');

module.exports = {
  createProduct: {
    body: {
      productName: joi.string().min(1).max(100).required().label('Name'),
      price: joi.number().required().label('Price'),
      quantity: joi.number().required().label('Quantity'),
    },
  },

  updateProduct: {
    body: {
      productName: joi.string().min(1).max(100).required().label('Name'),
      price: joi.number().min(1).required().label('Price'),
      quantity: joi.number().required().label('Quantity'),
    },
  },
  createOrder: {
    body: {
      custName: joi.string().min(1).max(100).label('Customer Name'),
      productName: joi.string().required().label('Product Name'),
      price: joi.number().min(1).required().label('Price'),
      quantity: joi.number().integer().min(1).required().label('Quantity'),
      address: joi.string().required().min(1).max(100).label('Address'),
    },
  },
};
