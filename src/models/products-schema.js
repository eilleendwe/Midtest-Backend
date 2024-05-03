const productsSchema = {
  productId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
};

module.exports = productsSchema;
