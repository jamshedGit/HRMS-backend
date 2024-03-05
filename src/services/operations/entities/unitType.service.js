const httpStatus = require("http-status");
const { UnitTypeModel } = require("../../../models");
const ApiError = require("../../../utils/ApiError");

/**
 * Create a UnitType
 * @param {Object} UnitTypeBody
 * @returns {Promise<UnitType>}
 */
const createUnitType = async (req, UnitTypeBody) => {
  UnitTypeBody.slug = UnitTypeBody.name.replace(/ /g, "-").toLowerCase();
  UnitTypeBody.createdBy = req.user.id;
  const unitTypeAdded = await UnitTypeModel.create(UnitTypeBody);

  return unitTypeAdded;
};

/**
 * Query for UnitsTypes
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUnitTypes = async (filter, options) => {
  let limit = options.limit;
  let offset = 0 + (options.page - 1) * limit;
  const UnitTypes = await UnitTypeModel.findAll({
    offset: offset,
    limit: limit,
  });
  return UnitTypes;
};

/**
 * Get UnitType by id
 * @param {ObjectId} id
 * @returns {Promise<UnitTypeModel>}
 */
const getUnitTypeById = async (id) => {
  return UnitTypeModel.findByPk(id);
};

/**
 * Update UnitType by id
 * @param {ObjectId} UnitTypeId
 * @param {Object} updateBody
 * @returns {Promise<UnitTypeModel>}
 */
const updateUnitTypeById = async (UnitTypeId, updateBody, updatedBy) => {
  const UnitType = await getUnitTypeById(UnitTypeId);
  if (!UnitType) {
    throw new ApiError(httpStatus.NOT_FOUND, "Unit Type not found");
  }
  updateBody.slug = updateBody.name.replace(/ /g, "-").toLowerCase()
  updateBody.updatedBy = updatedBy;
  delete updateBody.id;
  Object.assign(UnitType, updateBody);
  await UnitType.save();
  return UnitType;
};

/**
 * Delete UnitType by id
 * @param {ObjectId} UnitTypeId
 * @returns {Promise<UnitTypeModel>}
 */
const deleteUnitTypeById = async (UnitTypeId) => {
  const UnitType = await getUnitTypeById(UnitTypeId);
  if (!UnitType) {
    throw new ApiError(httpStatus.NOT_FOUND, "Unit Type not found");
  }
  await UnitType.destroy();
  return UnitType;
};

module.exports = {
  createUnitType,
  queryUnitTypes,
  getUnitTypeById,
  updateUnitTypeById,
  deleteUnitTypeById,
};
