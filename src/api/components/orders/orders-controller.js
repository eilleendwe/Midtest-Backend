const ordersService = require('./orders-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

/**
 * Handle get list of orders request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getOrders(request, response, next) {
  try {
    //jumlah semua data order yang ada
    const totalOrders = await ordersService.getOrders();

    // nilai default kalau kosong = 1
    const page_number = parseInt(request.query.page_number) || 1;
    // nilai default kalau kosong = semua data yang ada / data yanag di search
    const page_size = parseInt(request.query.page_size) || totalOrders.length;
    // nilai default kalau kosong = tidak ada
    const search = request.query.search || '';
    // nilai default kalau kosong = tidak ada, maka diurutkan secara ascending
    const sort = request.query.sort || '';

    const { results } = await ordersService.getOrdersSearchSort(
      search,
      sort,
      page_number,
      page_size
    );

    //jumlah data order yang dicari/searched
    const { jumlahSearchedOrders } =
      await ordersService.getOrdersSearchSort(search);

    //pembulatan keatas
    const total_pages = Math.ceil(jumlahSearchedOrders / page_size);

    return response.status(200).json({
      page_number: page_number,
      page_size: page_size,
      count: jumlahSearchedOrders,
      has_previous_page: page_number > 1,
      //kalau total_pages > page_number maka has_next_page = true
      has_next_page: page_number < total_pages,
      total_pages: total_pages,
      data: results,
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle get order detail request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getOrder(request, response, next) {
  try {
    const order = await ordersService.getOrder(request.params.id);

    if (!order) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Unknown order');
    }

    return response.status(200).json(order);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle update order request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function updateOrder(request, response, next) {
  try {
    const id = request.params.id;
    const productName = request.body.productName;
    const price = request.body.price;
    const quantity = request.body.quantity;

    const success = await ordersService.updateOrder(
      id,
      productName,
      price,
      quantity
    );
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update order'
      );
    }

    return response
      .status(200)
      .json({ message: `Order ${productName} has been updated` });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle delete order request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function deleteOrder(request, response, next) {
  try {
    const id = request.params.id;

    const success = await ordersService.deleteOrder(id);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete order'
      );
    }

    return response.status(200).json({ message: `Order has been deleted` });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder,
};
