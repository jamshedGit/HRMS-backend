const httpStatus = require("http-status");
const { RoundingPolicyModel, FormModel } = require("../../../models/index");
const ApiError = require("../../../utils/ApiError");
const Sequelize = require('sequelize');
const { paginationFacts } = require("../../../utils/common");
const pick = require("../../../utils/pick");
const { Salary_Rounding_Policy_Type } = require("./enum/salary_rounding_policy.enum");

const Op = Sequelize.Op;

//Attributes required for Rounding Policy Table view
const roundingAttribute = [
  'paymentModeName',
  'amount',
  'Id',
  'isActive',
  'paymentMode'
]

/**
 * Create Rounding Policy
 * 
 * @param {Object} req 
 * @returns 
 */
const createRoundingPolicy = async (req) => {
  const filter = { paymentMode: req.body.paymentMode }
  const oldRecord = await getRoundingPolicy(filter, roundingAttribute);
  if (oldRecord) {
    throw new ApiError(httpStatus.CONFLICT, `Record for ${oldRecord.paymentModeName} already Present`);
  }
  const createdData = await RoundingPolicyModel.create({
    ...req.body,
    createdBy: req.user.id,
    companyId: 1,
    subsidiaryId: 1,
    paymentModeName: Salary_Rounding_Policy_Type[req.body.paymentMode]
  });
  const data = await getRoundingPolicy({ id: createdData.Id }, roundingAttribute);
  return data;
};

/**
 * Update Single Rounding By Id
 * 
 * @param {Object} body 
 * @param {Number} updatedBy 
 * @returns 
 */
const updateRoundingPolicyById = async (body, updatedBy) => {
  const filter = { Id: body.Id }
  const oldRecord = await getRoundingPolicy(filter);
  if (oldRecord && oldRecord.paymentMode == body.paymentMode) {
    throw new ApiError(httpStatus.CONFLICT, `Record for ${oldRecord.paymentModeName} already Present`);
  }
  body.updatedBy = updatedBy;
  body.paymentModeName = Salary_Rounding_Policy_Type[body.paymentMode];
  Object.assign(oldRecord, body);
  const updatedData = await oldRecord.save();
  const data = await getRoundingPolicy({ id: updatedData.Id }, roundingAttribute)
  return data;
};


/**
 * Get Single Rounding By Id
 * 
 * @param {Number} id 
 * @returns 
 */
const getRoundingPolicy = async (filters, attributes = null) => {
  const options = {};
  if (filters) {
    options.where = filters
  }
  if (attributes) {
    options.attributes = attributes
  }
  return await RoundingPolicyModel.findOne(options);
};

const getRoundingPolicyById = async (id) => {
  return await getRoundingPolicy({ id }, roundingAttribute)
}

/**
 * 
 * Get All Rounding Policies with Pagination
 * 
 * @param {Object} req 
 * @returns 
 */
const getAllRoundingPolicies = async (req) => {
  const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
  const searchQuery = req?.body?.filter?.searchQuery?.toLowerCase() || '';
  const limit = options.pageSize;
  const offset = 0 + (options.pageNumber - 1) * limit;
  const queryFilters = [
    { Name: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('paymentModeName')), 'LIKE', '%' + searchQuery + '%') },
  ]

  const { count, rows } = await RoundingPolicyModel.findAndCountAll({
    order: [
      ['createdAt', 'DESC']
    ],
    where: {
      [Op.or]: queryFilters,
      // isActive: true
    },
    attributes: roundingAttribute,
    offset: offset,
    limit: limit,
  });

  return paginationFacts(count, limit, options.pageNumber, rows);
};

/**
 * Delete Single Rounding Record By Id
 * 
 * @param {Number} id 
 * @returns 
 */
const deleteRoundingPolicyById = async (id) => {
  const oldRecord = await getRoundingPolicyById(id);
  if (!oldRecord) {
    throw new ApiError(httpStatus.NOT_FOUND, "Record not found");
  }
  await oldRecord.destroy();
  return oldRecord;
};


const getPaymentModes = async (id) => {
  return await FormModel.findAll({
    where: { parentFormID: id }
  })
}


module.exports = {
  createRoundingPolicy,
  updateRoundingPolicyById,
  getRoundingPolicyById,
  getAllRoundingPolicies,
  deleteRoundingPolicyById,
  getPaymentModes
};