const { custName } = require('../../../models/orders-schema');
const ordersRepository = require('./orders-repository');

/**
 * Menghandle list of orders yang di search / yang dicari
 * @param {string} search - yang di cari (email/name)
 * @param {string} sort - jenis sort yg diinginkan (asc/desc)
 * @param {string} page_number - page ke berapa
 * @param {string} page_size - banyak data yang ada dalam 1 halaman
 * @returns {object} Response object or pass an error to the next route
 */
async function getOrdersSearchSort(search, sort, page_number, page_size) {
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

  const orders = await ordersRepository.getOrdersSearchSort(
    searchQuery,
    sortQuery,
    page_number,
    page_size
  );

  const results = [];
  for (let i = 0; i < orders.length; i += 1) {
    const order = orders[i];
    results.push({
      id: order.id,
      custName: order.custName,
      productName: order.productName,
      price: order.price,
      quantity: order.quantity,
    });
  }

  const jumlahSearchedOrders =
    await ordersRepository.searchedOrdersCount(searchQuery);

  return { results, jumlahSearchedOrders };
}

/**
 * Get list of orders
 * @returns {Array}
 */
async function getOrders() {
  const orders = await ordersRepository.getOrders();

  const results = [];
  for (let i = 0; i < orders.length; i += 1) {
    const order = orders[i];
    results.push({
      id: order.id,
      custName: order.custName,
      productName: order.productName,
      price: order.price,
      quantity: order.quantity,
    });
  }
  return results;
}

/**
 * Get order detail
 * @param {string} orderId - order ID
 * @returns {Object}
 */
async function getOrder(id) {
  const order = await ordersRepository.getOrder(id);

  // order not found
  if (!order) {
    return null;
  }

  return {
    id: order.id,
    custName: order.custName,
    productName: order.productName,
    price: order.price,
    quantity: order.quantity,
  };
}

/**
 * Update existing order
 * @param {string} id - order ID
 * @param {string} name - order name
 * @param {string} price - order price
 * @returns {boolean}
 */
async function updateOrder(id, productName, price, quantity) {
  const order = await ordersRepository.getOrder(id);

  // Order not found
  if (!order) {
    return null;
  }

  try {
    await ordersRepository.updateOrder(id, productName, price, quantity);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete order
 * @param {string} orderId - Order ID
 * @returns {boolean}
 */
async function deleteOrder(id) {
  const order = await ordersRepository.getOrder(id);

  // Order not found
  if (!order) {
    return null;
  }

  try {
    await ordersRepository.deleteOrder(id);
  } catch (err) {
    return null;
  }

  return true;
}

module.exports = {
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder,
  getOrdersSearchSort,
};
