const httpStatus = require("http-status");
const { TransactionMasterModel } = require("../../../models");
const ApiError = require("../../../utils/ApiError");

/**
 * Create a TransactionMaster
 * @param {Object} TransactionMasterBody
 * @returns {Promise<TransactionMaster>}
 */
const createtransactionMaster = async (req, TransactionMasterBody) => {
  // TransactionMasterBody.slug = TransactionMasterBody.name.replace(/ /g, "-").toLowerCase();
  TransactionMasterBody.createdBy = req.user.id;
  const TransactionMasterAdded = await TransactionMasterModel.create(TransactionMasterBody);

  return TransactionMasterAdded;
};

/**
 * Query for TransactionMasters
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryTransactionMasters = async (filter, options) => {
  let limit = options.limit;
  let offset = 0 + (options.page - 1) * limit;
  const TransactionMasters = await TransactionMasterModel.findAll({
    offset: offset,
    limit: limit,
  });
  return TransactionMasters;
};

/**
 * Get TransactionMaster by id
 * @param {ObjectId} id
 * @returns {Promise<TransactionMasterModel>}
 */
const getTransactionMasterById = async (id) => {
  return TransactionMasterModel.findByPk(id);
};

/**
 * Update TransactionMaster by id
 * @param {ObjectId} TransactionMasterId
 * @param {Object} updateBody
 * @returns {Promise<TransactionMasterModel>}
 */
const updateTransactionMasterById = async (TransactionMasterId, updateBody, updatedBy) => {
  const TransactionMaster = await getTransactionMasterById(TransactionMasterId);
  if (!TransactionMaster) {
    throw new ApiError(httpStatus.NOT_FOUND, "Transaction Master not found");
  }
  // updateBody.slug = updateBody.name.replace(/ /g, "-").toLowerCase()
  updateBody.updatedBy = updatedBy;
  delete updateBody.id;
  Object.assign(TransactionMaster, updateBody);
  await TransactionMaster.save();
  return TransactionMaster;
};

/**
 * Delete TransactionMaster by id
 * @param {ObjectId} TransactionMasterId
 * @returns {Promise<TransactionMasterModel>}
 */
const deleteTransactionMasterById = async (TransactionMasterId) => {
  const TransactionMaster = await getTransactionMasterById(TransactionMasterId);
  if (!TransactionMaster) {
    throw new ApiError(httpStatus.NOT_FOUND, "Transaction Master not found");
  }
  await TransactionMaster.destroy();
  return TransactionMaster;
};

module.exports = {
  createtransactionMaster,
  queryTransactionMasters,
  getTransactionMasterById,
  updateTransactionMasterById,
  deleteTransactionMasterById,
};
