// const { customerId } = require('./customers-schema');

const ordersSchema = {
  orderId: { type: String, required: true, unique: true },
  products: [
    {
      productId: String,
      quantity: Number,
    },
  ],
  date: Date,
};

module.exports = ordersSchema;
