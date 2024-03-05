const httpStatus = require("http-status");
const { VehicleCategoryModel } = require("../../../models");
const ApiError = require("../../../utils/ApiError");

/**
 * Create a VehicleCategory
 * @param {Object} VehicleCategoryBody
 * @returns {Promise<VehicleCategory>}
 */
const createVehicleCategory = async (req, VehicleCategoryBody) => {
  // IncidentDetailBody.slug = IncidentDetailBody.callerName.replace(/ /g, "-").toLowerCase();
  VehicleCategoryBody.createdBy = req.user.id;
  const VehicleCategoryAdded = await VehicleCategoryModel.create(VehicleCategoryBody);

  return VehicleCategoryAdded;
};

/**
 * Query for VehicleCategory
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryVehicleCategories = async (filter, options) => {
  let limit = options.limit;
  let offset = 0 + (options.page - 1) * limit;
  const VehicleCategories = await VehicleCategoryModel.findAll({
    offset: offset,
    limit: limit,
  });
  return VehicleCategories;
};

/**
 * Get VehicleCategory by id
 * @param {ObjectId} id
 * @returns {Promise<VehicleCategoryModel>}
 */
const getVehicleCategoryById = async (id) => {
  return VehicleCategoryModel.findByPk(id);
};

/**
 * Update VehicleCategory by id
 * @param {ObjectId} VehicleCategoryId
 * @param {Object} updateBody
 * @returns {Promise<VehicleCategoryModel>}
 */
const updateVehicleCategoryById = async (VehicleCategoryId, updateBody, updatedBy) => {
  const VehicleCategory = await getVehicleCategoryById(VehicleCategoryId);
  if (!VehicleCategory) {
    throw new ApiError(httpStatus.NOT_FOUND, "Vehicle Category not found");
  }
  // updateBody.slug = updateBody.callerName.replace(/ /g, "-").toLowerCase()
  updateBody.updatedBy = updatedBy;
  delete updateBody.id;
  Object.assign(VehicleCategory, updateBody);
  await VehicleCategory.save();
  return VehicleCategory;
};

/**
 * Delete VehicleCategory by id
 * @param {ObjectId} VehicleCategoryId
 * @returns {Promise<VehicleCategoryModel>}
 */
const deleteVehicleCategoryById = async (VehicleCategoryId) => {
  const VehicleCategory = await getVehicleCategoryById(VehicleCategoryId);
  if (!VehicleCategory) {
    throw new ApiError(httpStatus.NOT_FOUND, "Vehicle Category not found");
  }
  await VehicleCategory.destroy();
  return VehicleCategory;
};

module.exports = {
  createVehicleCategory,
  queryVehicleCategories,
  getVehicleCategoryById,
  updateVehicleCategoryById,
  deleteVehicleCategoryById,
};
