const productsRepository = require('./products-repository');

/**
 * Menghandle list of users yang di search / yang dicari
 * @param {string} search - yang di cari (email/name)
 * @param {string} sort - jenis sort yg diinginkan (asc/desc)
 * @param {string} page_number - page ke berapa
 * @param {string} page_size - banyak data yang ada dalam 1 halaman
 * @returns {object} Response object or pass an error to the next route
 */
async function getProductsSearchSort(search, sort, page_number, page_size) {
  let searchField, searchKey;
  if (search) {
    const [field, key] = search.split(':');
    searchField = field;
    searchKey = key;
  }

  let searchQuery = {};
  if (searchField === 'name') {
    searchQuery.name = { $regex: searchKey, $options: 'i' };
  } else if (searchField === 'category') {
    searchQuery.category = { $regex: searchKey, $options: 'i' };
  }

  let sortQuery = {};
  if (sort) {
    const [sortField, sortOrder] = sort.split(':');
    if (sortOrder === 'desc') {
      sortQuery[sortField] = -1;
    } else {
      sortQuery[sortField] = 1;
    }
  } else {
    sortQuery['name'] = 1;
  }

  const products = await productsRepository.getProductsSearchSort(
    searchQuery,
    sortQuery,
    page_number,
    page_size
  );

  const results = [];
  for (let i = 0; i < products.length; i += 1) {
    const product = products[i];
    results.push({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      quantity: product.quantity,
    });
  }

  const jumlahSearchedProducts =
    await productsRepository.searchedProductsCount(searchQuery);

  return { results, jumlahSearchedProducts };
}

/**
 * Get list of users
 * @returns {Array}
 */
async function getProducts() {
  const products = await productsRepository.getProducts();

  const results = [];
  for (let i = 0; i < products.length; i += 1) {
    const product = products[i];
    results.push({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      quantity: product.quantity,
    });
  }
  return results;
}

/**
 * Get product detail
 * @param {string} productId - product ID
 * @returns {Object}
 */
async function getProduct(id) {
  const product = await productsRepository.getproduct(id);

  // product not found
  if (!product) {
    return null;
  }

  return {
    id: product.id,
    name: product.name,
    category: product.category,
    price: product.price,
    quantity: product.quantity,
  };
}

/**
 * Create product
 * @param {string} name - product name
 * @param {string} category - product category
 * @param {string} price - product price
 * @returns {boolean}
 */
async function createProduct(name, category, price, quantity) {
  try {
    await productsRepository.createProduct(name, category, price, quantity);
  } catch (err) {
    return null;
  }
  return true;
}

/**
 * Update existing product
 * @param {string} id - product ID
 * @param {string} name - product name
 * @param {string} category - product category
 * @param {string} price - product price
 * @returns {boolean}
 */
async function updateProduct(id, name, category, price, quantity) {
  const product = await productsRepository.getProduct(id);

  // User not found
  if (!product) {
    return null;
  }

  try {
    await productsRepository.updateProduct(id, name, category, price, quantity);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete product
 * @param {string} productId - User ID
 * @returns {boolean}
 */
async function deleteProduct(id) {
  const product = await productsRepository.getProduct(id);

  // User not found
  if (!product) {
    return null;
  }

  try {
    await productsRepository.deleteProduct(id);
  } catch (err) {
    return null;
  }

  return true;
}

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsSearchSort,
};
