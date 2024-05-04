const joi = require('joi');

module.exports = {
  createProduct: {
    body: {
      // productId: joi.string().min(1).max(16).required().label('ProductId'),
      name: joi.string().min(1).max(100).required().label('Name'),
      category: joi.string().min(1).max(30).required().label('Category'),
      price: joi.number().required().label('Price'),
      quantity: joi.number().required().label('Quantity'),
    },
  },

  updateProduct: {
    body: {
      // productId: joi.string().min(1).max(16).required().label('ProductId'),
      name: joi.string().min(1).max(100).required().label('Name'),
      category: joi.string().min(1).max(25).required().label('Category'),
      price: joi.number().min(1).required().label('Price'),
      quantity: joi.number().required().label('Quantity'),
    },
  },
};
