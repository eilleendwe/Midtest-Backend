const productsRepository = require('./products-repository');
/**
 * Mengeceka apakah product ada di db
 * @param {string} productName - product name
 * @returns {boolean}
 */
async function isProductExist(productName) {
  const product = await productsRepository.getProductByName(productName);

  if (product) {
    return true;
  }

  return false;
}

/**
 * Membuat order baru
 * @param {string} custName - order ID
 * @param {string} productName - product name
 * @param {number} price - order price
 * @param {number} quantity - order quantity
 * @param {string} address - customer address
 * @returns {object}
 */
async function createOrder(custName, productName, price, quantity, address) {
  // Check if the product exists
  const product = await productsRepository.getProductByName(productName);
  if (!product) {
    throw new Error('Product not found');
  }
  if (product.quantity < quantity) {
    throw new Error('Insufficient product quantity');
  }

  // Update the product quantity
  await productsRepository.updateProduct(
    product._id,
    product.name,
    product.price,
    product.quantity - quantity
  );

  // Create new order
  const newOrder = await productsRepository.createOrder({
    custName,
    productName,
    price,
    quantity,
    address,
  });

  return newOrder;
}

/**
 * Menghandle list of users yang di search / yang dicari
 * @param {string} search - yang di cari (email/name)
 * @param {string} sort - jenis sort yg diinginkan (asc/desc)
 * @param {number} page_number - page ke berapa
 * @param {number} page_size - banyak data yang ada dalam 1 halaman
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
  if (searchField === 'productName') {
    searchQuery.productName = { $regex: searchKey, $options: 'i' };
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
    sortQuery['productName'] = 1;
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
      productName: product.productName,
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
      productName: product.productName,
      price: product.price,
      quantity: product.quantity,
    });
  }
  return results;
}

/**
 * Get product detail
 * @param {string} id - product ID
 * @returns {Object}
 */
async function getProduct(id) {
  const product = await productsRepository.getProduct(id);

  // product not found
  if (!product) {
    return null;
  }

  return {
    id: product.id,
    productName: product.productName,
    price: product.price,
    quantity: product.quantity,
  };
}

/**
 * Create product
 * @param {string} productName - product name
 * @param {number} price - product price
 * @param {number} quantity - product quantity
 * @returns {boolean}
 */
async function createProduct(productName, price, quantity) {
  try {
    await productsRepository.createProduct(productName, price, quantity);
  } catch (err) {
    return null;
  }
  return true;
}

/**
 * Update existing product
 * @param {string} id - product ID
 * @param {string} productName - product name
 * @param {number} price - product price
 * @param {number} quantity - product quantity
 * @returns {boolean}
 */
async function updateProduct(id, productName, price, quantity) {
  const product = await productsRepository.getProduct(id);

  // User not found
  if (!product) {
    return null;
  }

  try {
    await productsRepository.updateProduct(id, productName, price, quantity);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete product
 * @param {string} id - User ID
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
  isProductExist,
  createOrder,
};
