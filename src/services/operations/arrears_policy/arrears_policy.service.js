const httpStatus = require("http-status");
const { ArrearPolicyModel } = require("../../../models/index");
const ApiError = require("../../../utils/ApiError");
const Sequelize = require('sequelize');
const { paginationFacts } = require("../../../utils/common");
const pick = require("../../../utils/pick");
const { Arrear_Policy_Type } = require("./enum/arrears_policy.enum");

const Op = Sequelize.Op;

/**
 * Create Arrear Policy
 * 
 * @param {Object} req 
 * @returns 
 */
const createArrearPolicy = async (req) => {
  const payload = {
    ...req.body,
    createdBy: req.user.id,
    companyId: 1,
    subsidiaryId: 1,
    type_name: Arrear_Policy_Type[req.body.type],
    isActive: true
  }
  const createdData = await ArrearPolicyModel.create(payload);
  return createdData;
};


/**
 * 
 * Get All Arrear Policies with Pagination
 * 
 * @param {Object} req 
 * @returns 
 */
const getAllArrearPolicies = async (req) => {
  const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
  const searchQuery = req?.body?.filter?.searchQuery?.toLowerCase() || '';
  const limit = options.pageSize;
  const offset = 0 + (options.pageNumber - 1) * limit;
  const queryFilters = [
    { Name: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('type_name')), 'LIKE', '%' + searchQuery + '%') },
  ]

  const { count, rows } = await ArrearPolicyModel.findAndCountAll({
    order: [
      ['createdAt', 'DESC']
    ],
    where: {
      [Op.or]: queryFilters,
      // isActive: true
    },
    attributes: ['type_name', 'type', 'Id', 'isActive'],
    offset: offset,
    limit: limit,
  });

  return paginationFacts(count, limit, options.pageNumber, rows);
};


/**
 * Get Single Arear By Id
 * 
 * @param {Number} id 
 * @returns 
 */
const getArrearById = async (id) => {
  return ArrearPolicyModel.findByPk(id, {
    attributes: ['divisor', 'multiplier', 'days', 'type_name', 'type', 'Id'],
  });
};


/**
 * Update Single Arrear By Id
 * 
 * @param {Object} body 
 * @param {Number} updatedBy 
 * @returns 
 */
const updateArrearById = async (body, updatedBy) => {
  const oldRecord = await getArrearById(body.Id);
  if (!oldRecord) {
    throw new ApiError(httpStatus.NOT_FOUND, "Record not found");
  }
  body.updatedBy = updatedBy;
  body.type_name = Arrear_Policy_Type[body.type];
  Object.assign(oldRecord, body);
  const { type_name, type, Id } = await oldRecord.save();
  return { type_name, type, Id, isActive: true };
};


/**
 * Delete Single Arrear Record By Id
 * 
 * @param {Number} id 
 * @returns 
 */
const deleteArrearById = async (id) => {
  const oldRecord = await getArrearById(id);
  if (!oldRecord) {
    throw new ApiError(httpStatus.NOT_FOUND, "Record not found");
  }
  await oldRecord.destroy();
  return oldRecord;
};

module.exports = {
  getAllArrearPolicies,
  getArrearById,
  updateArrearById,
  deleteArrearById,
  createArrearPolicy
};
