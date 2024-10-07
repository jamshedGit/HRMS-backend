const httpStatus = require("http-status");
const { ArrearPolicyModel } = require("../../../models/index");
const ApiError = require("../../../utils/ApiError");
const Sequelize = require('sequelize');
const { paginationFacts } = require("../../../utils/common");
const pick = require("../../../utils/pick");
const { Arrear_Policy_Type } = require("./enum/arrears_policy.enum");

const Op = Sequelize.Op;

//Attributes required for Arrear Table view
const arrearAttribute = [
  'type_name',
  'type',
  'Id',
  'isActive',
  [Sequelize.literal(`CASE WHEN multiplier < 1 THEN '-' ELSE multiplier END`), 'multiplier'],
  [Sequelize.literal(`CASE WHEN divisor < 1 THEN '-' ELSE divisor END`), 'divisor'],
  [Sequelize.literal(`CASE WHEN days < 1 THEN '-' ELSE days END`), 'days']
]

//Update Body values according to type (arrear type)
const handleBodyvalues = (body)=> {
  if(body.type == 1){
    body.divisor = body.multiplier = body.days = 0
  }
  else if(body.type == 2){
    body.days = 0
  }
  else if(body.type == 3){
    body.multiplier = body.divisor = 0
  }
  return body;
}

/**
 * Create Arrear Policy
 * 
 * @param {Object} req 
 * @returns 
 */
const createArrearPolicy = async (req) => {
  const body = handleBodyvalues(req.body)
  const payload = {
    ...body,
    createdBy: req.user.id,
    companyId: 1,
    subsidiaryId: 1,
    type_name: Arrear_Policy_Type[req.body.type]
  }
  const createdData = await ArrearPolicyModel.create(payload);
  const data = await getArrearById(createdData.Id, arrearAttribute)
  return data;
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
    attributes: [
      'type_name',
      'type',
      'Id',
      'isActive',
      [Sequelize.literal(`CASE WHEN multiplier < 1 THEN '-' ELSE multiplier END`), 'multiplier'],
      [Sequelize.literal(`CASE WHEN divisor < 1 THEN '-' ELSE divisor END`), 'divisor'],
      [Sequelize.literal(`CASE WHEN days < 1 THEN '-' ELSE days END`), 'days'],
    ],
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
const getArrearById = async (id, options = null ) => {
  return ArrearPolicyModel.findByPk(id, {
    attributes: options || ['divisor', 'multiplier', 'days', 'type_name', 'type', 'Id'],
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
  const obj = handleBodyvalues(body)
  Object.assign(oldRecord, obj);
  const updatedData = await oldRecord.save();
  const data = await getArrearById(updatedData.Id, arrearAttribute)
  return data;
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
