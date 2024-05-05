const { Order } = require('../../../models');

/**
 * Get a list of Orders
 * @returns {Promise}
 */
async function getOrders() {
  return Order.find({});
}

/**
 * Get order detail
 * @param {string} id - order ID
 * @returns {Promise}
 */
async function getOrder(id) {
  return Order.findById(id);
}

/**
 * Update existing order
 * @param {string} id - order ID
 * @param {string} productName - product name
 * @param {string} price - product price
 * @returns {Promise}
 */
async function updateOrder(id, custName, productName, price, quantity) {
  return Order.findOneAndUpdate(
    {
      _id: id,
    },
    {
      $set: {
        custName: custName,
        productName: productName,
        price: price,
        quantity: quantity,
      },
    }
  );
}

/**
 * Delete an order
 * @param {string} orderId - order ID
 * @returns {Promise}
 */
async function deleteOrder(id) {
  return Order.deleteOne({ _id: id });
}

/**
 * Count how many orders match the search query
 * @param {string} searchQuery - search keyword
 * @returns {Promise}
 */
async function searchedOrdersCount(searchQuery) {
  return Order.countDocuments(searchQuery);
}

/**
 * Handle a list of orders that are searched and sorted
 * @param {object} searchQuery - what is being searched (email/name)
 * @param {object} sortQuery - desired sort type (asc/desc)
 * @param {string} page_number - which page
 * @param {string} page_size - how many data in 1 page
 * @returns {Promise}
 */
async function getOrdersSearchSort(
  searchQuery,
  sortQuery,
  page_number,
  page_size
) {
  return Order.find(searchQuery)
    .sort(sortQuery)
    .skip((page_number - 1) * page_size)
    .limit(page_size);
}

module.exports = {
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder,
  searchedOrdersCount,
  getOrdersSearchSort,
};
