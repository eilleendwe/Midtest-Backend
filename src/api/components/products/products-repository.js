const { Product } = require('../../../models/index');

/**
 * Get a list of Products
 * @returns {Promise}
 */
async function getProducts() {
  return Product.find({});
}

/**
 * Get product detail
 * @param {string} id - product ID
 * @returns {Promise}
 */
async function getProduct(id) {
  return Product.findById(id);
}

/**
 * Create new product
 * @param {string} name - product name
 * @param {string} category - product category
 * @param {string} price - product price
 * @returns {Promise}
 */
async function createProduct(name, category, price, quantity) {
  return Product.create({
    name,
    category,
    price,
    quantity,
  });
}

/**
 * Update existing product
 * @param {string} id - product ID
 * @param {string} name - product name
 * @param {string} category - product category
 * @param {string} price - product price
 * @returns {Promise}
 */
async function updateProduct(id, name, category, price, quantity) {
  return Product.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        name,
        category,
        price,
        quantity,
      },
    }
  );
}

/**
 * Delete a product
 * @param {string} productId - product ID
 * @returns {Promise}
 */
async function deleteProduct(id) {
  return Product.deleteOne({ _id: id });
}

/**
 * Menghitung berapa banyak product yang di search / yang dicari
 * @param {string} searchQuery - kata kunci yang dicari
 * @returns {Promise}
 */
async function searchedProductsCount(searchQuery) {
  return Product.countDocuments(searchQuery);
}

/**
 * Mengandle list of product yang di search dan sort
 * @param {object} searchQuery - yang di cari (email/name)
 * @param {object} sortQuery - jenis sort yg diinginkan (asc/desc)
 * @param {string} page_number - page ke berapa
 * @param {string} page_size - banyak data yang ada dalam 1 halaman
 * @returns {Promise}
 */
async function getProductsSearchSort(
  searchQuery,
  sortQuery,
  page_number,
  page_size
) {
  return Product.find(searchQuery)
    .sort(sortQuery)
    .skip((page_number - 1) * page_size)
    .limit(page_size);
}

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  searchedProductsCount,
  getProductsSearchSort,
};
