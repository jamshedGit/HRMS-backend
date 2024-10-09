const httpStatus = require("http-status");
const { RoundingPolicyModel, FormModel } = require("../../../models/index");
const ApiError = require("../../../utils/ApiError");
const Sequelize = require('sequelize');
const { paginationFacts, updateDataValues } = require("../../../utils/common");
const pick = require("../../../utils/pick");

const Op = Sequelize.Op;

//Attributes required for Rounding Policy Table view
const roundingAttribute = [
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
    throw new ApiError(httpStatus.CONFLICT, `Record for This mode already Present`);
  }
  const createdData = await RoundingPolicyModel.create({
    ...req.body,
    createdBy: req.user.id,
    companyId: 1,
    subsidiaryId: 1,
  });
  const data = await getRoundingPolicy({ id: createdData.Id }, roundingAttribute, [{ model: FormModel, attributes: ['formName'] }]);
  return updateDataValues(data, 't_form_menu', 'formName');
};

/**
 * Update Single Rounding By Id
 * 
 * @param {Object} body 
 * @param {Number} updatedBy 
 * @returns 
 */
const updateRoundingPolicyById = async (body, updatedBy) => {
  const filter = { paymentMode: body.paymentMode }
  let oldRecord = await getRoundingPolicy(filter);
  if (oldRecord && oldRecord.Id != body.Id) {
    throw new ApiError(httpStatus.CONFLICT, `Record for this mode already Present`);
  }
  else {
    oldRecord = await getRoundingPolicy({ Id: body.Id })
  }
  body.updatedBy = updatedBy;
  Object.assign(oldRecord, body);
  const updatedData = await oldRecord.save();
  const data = await getRoundingPolicy({ id: updatedData.Id }, roundingAttribute, [{ model: FormModel, attributes: ['formName'] }])
  return updateDataValues(data, 't_form_menu', 'formName')
};


/**
 * Get Single Rounding By Id
 * 
 * @param {Number} id 
 * @returns 
 */
const getRoundingPolicy = async (filters, attributes = null, include = null) => {
  const options = {};
  if (filters) {
    options.where = filters
  }
  if (attributes) {
    options.attributes = attributes
  }
  if (include) {
    options.include = include
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
    { Name: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('formName')), 'LIKE', '%' + searchQuery + '%') },
  ]

  const { count, rows } = await RoundingPolicyModel.findAndCountAll({
    order: [
      ['createdAt', 'DESC']
    ],
    attributes: roundingAttribute,
    include: [{
      where: {
        [Op.or]: queryFilters,
      },
      model: FormModel,
      attributes: ['formName']  // Only fetch the 'name' field from table `b`
    }],
    offset: offset,
    limit: limit,
  });

  const updatedRows = updateDataValues(rows, 't_form_menu', 'formName')
  return paginationFacts(count, limit, options.pageNumber, updatedRows);
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