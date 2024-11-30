const httpStatus = require("http-status");
const { RoundingPolicyModel, FormModel } = require("../../../models/index");
const ApiError = require("../../../utils/ApiError");
const Sequelize = require('sequelize');
const { paginationFacts, handleNestedData } = require("../../../utils/common");
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
    //If Old record is present with same payment mode then show error. There will be only one record for each mode.
    throw new ApiError(httpStatus.CONFLICT, `Record for This mode already Present`);  
  }
  const createdData = await RoundingPolicyModel.create({
    ...req.body,
    createdBy: req.user.id,
    companyId: 1,
    subsidiaryId: 1,
  });
  return await getRoundingPolicy({ id: createdData.Id }, roundingAttribute, [{ model: FormModel, attributes: ['formName'] }]);
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
    //If Old record is present with same payment mode with different Id then show error. There will be only one record for each mode.
    throw new ApiError(httpStatus.CONFLICT, `Record for this mode already Present`);
  }
  else {
    //else get the record by Id to update the record
    oldRecord = await getRoundingPolicy({ Id: body.Id })
  }
  body.updatedBy = updatedBy;
  Object.assign(oldRecord, body);
  const updatedData = await oldRecord.save();
  return await getRoundingPolicy({ id: updatedData.Id }, roundingAttribute, [{ model: FormModel, attributes: ['formName'] }])
};


/**
 * 
 * @param {Object} filters filtering Options
 * @param {Array} attributes Keys wanted in return (If null then will return all keys)
 * @param {Array} include  Get data of different table with foreign key relation
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

  //If Include is present then the returned data from the other table are under the key of table name. So we use handleNestedData
  if (include) {
    const data = await RoundingPolicyModel.findOne(options);
    return handleNestedData(data)
  }
  //otherwise just return the requested data as is
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
  const searchQuery = req?.body?.filter?.searchQuery?.toLowerCase() || '';  //Get Search field value for filtering
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

  //If Include is present in the query the returned data from the other table are under the key of table name. So we use handleNestedData
  const updatedRows = handleNestedData(rows)
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


/**
 * 
 * Get Payment Mode Dropdown data
 * 
 * @param {String} id 
 * @returns 
 */
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