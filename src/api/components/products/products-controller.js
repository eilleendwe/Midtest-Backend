const productsService = require('./products-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

async function createOrder(request, response, next) {
  try {
    const custName = request.body.customerName;
    const productName = request.body.productName;
    const price = request.body.price;
    const quantity = request.body.quantity;
    const address = request.body.address;

    // Cek apakah produk ada?
    const productExist = await productsService.isProductExist(productName);

    if (!productExist) {
      throw errorResponder(errorTypes.NOT_FOUND, 'Product not found');
    }
    if (productExist.quantity < quantity) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Insufficient product quantity'
      );
    }

    // Update the product quantity
    await productsService.updateProduct(
      productExist._id,
      productExist.productName,
      productExist.price,
      productExist.quantity - quantity
    );

    // Save the order
    const savedOrder = await productsService.createOrder(
      custName,
      productName,
      price,
      quantity,
      address
    );

    return response.status(201).json(savedOrder);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle get list of products request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getProducts(request, response, next) {
  try {
    //jumlah semua data product yang ada
    const totalProducts = await productsService.getProducts();

    // nilai default kalau kosong = 1
    const page_number = parseInt(request.query.page_number) || 1;
    // nilai default kalau kosong = semua data yang ada / data yanag di search
    const page_size = parseInt(request.query.page_size) || totalProducts.length;
    // nilai default kalau kosong = tidak ada
    const search = request.query.search || '';
    // nilai default kalau kosong = tidak ada, maka diurutkan secara ascending
    const sort = request.query.sort || '';

    const { results } = await productsService.getProductsSearchSort(
      search,
      sort,
      page_number,
      page_size
    );

    //jumlah data product yang dicari/searched
    const { jumlahSearchedProducts } =
      await productsService.getProductsSearchSort(search);

    //pembulatan keatas
    const total_pages = Math.ceil(jumlahSearchedProducts / page_size);

    return response.status(200).json({
      page_number: page_number,
      page_size: page_size,
      count: jumlahSearchedProducts,
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
 * Handle get product detail request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getProduct(request, response, next) {
  try {
    const product = await productsService.getProduct(request.params.id);

    if (!product) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Unknown product');
    }

    return response.status(200).json(product);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle create product request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function createProduct(request, response, next) {
  try {
    const productName = request.body.productName;
    const price = request.body.price;
    const quantity = request.body.quantity;

    const success = await productsService.createProduct(
      productName,
      price,
      quantity
    );
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create product'
      );
    }

    return response.status(200).json({ productName, price, quantity });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle update product request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function updateProduct(request, response, next) {
  try {
    const id = request.params.id;
    const productName = request.body.productName;
    const price = request.body.price;
    const quantity = request.body.quantity;

    const success = await productsService.updateProduct(
      id,
      productName,
      price,
      quantity
    );
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update product'
      );
    }

    return response
      .status(200)
      .json({ message: `Product ${productName} has been updated` });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle delete product request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function deleteProduct(request, response, next) {
  try {
    const id = request.params.id;

    const success = await productsService.deleteProduct(id);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete product'
      );
    }

    return response.status(200).json({ message: `Product has been deleted` });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  createOrder,
};
