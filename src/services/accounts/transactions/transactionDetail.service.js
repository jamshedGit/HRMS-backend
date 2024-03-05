const httpStatus = require("http-status");
const { TransactionDetailModel } = require("../../../models");
const ApiError = require("../../../utils/ApiError");

/**
 * Create a TransactionDetail
 * @param {Object} TransactionDetailBody
 * @returns {Promise<TransactionDetail>}
 */
const createtransactionDetail = async (req, TransactionDetailBody) => {
  // TransactionDetailBody.slug = TransactionDetailBody.name.replace(/ /g, "-").toLowerCase();
  TransactionDetailBody.createdBy = req.user.id;
  const TransactionDetailAdded = await TransactionDetailModel.create(TransactionDetailBody);

  return TransactionDetailAdded;
};

/**
 * Query for TransactionDetails
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryTransactionDetails = async (filter, options) => {
  let limit = options.limit;
  let offset = 0 + (options.page - 1) * limit;
  const TransactionDetails = await TransactionDetailModel.findAll({
    offset: offset,
    limit: limit,
  });
  return TransactionDetails;
};

/**
 * Get TransactionDetail by id
 * @param {ObjectId} id
 * @returns {Promise<TransactionDetailModel>}
 */
const getTransactionDetailById = async (id) => {
  return TransactionDetailModel.findByPk(id);
};

/**
 * Update TransactionDetail by id
 * @param {ObjectId} TransactionDetailId
 * @param {Object} updateBody
 * @returns {Promise<TransactionDetailModel>}
 */
const updateTransactionDetailById = async (TransactionDetailId, updateBody, updatedBy) => {
  const TransactionDetail = await getTransactionDetailById(TransactionDetailId);
  if (!TransactionDetail) {
    throw new ApiError(httpStatus.NOT_FOUND, "Transaction Detail not found");
  }
  // updateBody.slug = updateBody.name.replace(/ /g, "-").toLowerCase()
  updateBody.updatedBy = updatedBy;
  delete updateBody.id;
  Object.assign(TransactionDetail, updateBody);
  await TransactionDetail.save();
  return TransactionDetail;
};

/**
 * Delete TransactionDetail by id
 * @param {ObjectId} TransactionDetailId
 * @returns {Promise<TransactionDetailModel>}
 */
const deleteTransactionDetailById = async (TransactionDetailId) => {
  const TransactionDetail = await getTransactionDetailById(TransactionDetailId);
  if (!TransactionDetail) {
    throw new ApiError(httpStatus.NOT_FOUND, "Transaction Detail not found");
  }
  await TransactionDetail.destroy();
  return TransactionDetail;
};

module.exports = {
  createtransactionDetail,
  queryTransactionDetails,
  getTransactionDetailById,
  updateTransactionDetailById,
  deleteTransactionDetailById,
};
