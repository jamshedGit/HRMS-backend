const httpStatus = require("http-status");
const axios = require("axios")
const StoppageAllowanceModel = require("../../../models/index");
const ApiError = require("../../../utils/ApiError");
const sequelize = require("../../../config/db");
const Sequelize = require('sequelize');
const { paginationFacts } = require("../../../utils/common");
const https = require('https');
const { XMLParser, XMLBuilder, XMLValidator } = require("fast-xml-parser");
const fns = require('date-fns')

const Op = Sequelize.Op;
/**
 * Create a Item
 * @param {Object} StoppageAllowanceBody
 * @returns {Promise<StoppageAllowance>}
 */
const createStoppageAllowance = async (req, StoppageAllowanceBody) => {
  console.log("StoppageAllowance Body", StoppageAllowanceBody)
  // StoppageAllowanceBody.slug = StoppageAllowanceBody.name.replace(/ /g, "-").toLowerCase();
  console.log(req.user.id);
  StoppageAllowanceBody.createdBy = req.user.id;
  console.log(StoppageAllowanceBody, "body");
  const addedStoppageAllowanceObj = await StoppageAllowanceModel.StoppageAllonceModel.create(StoppageAllowanceBody);
  //authSMSSend(addedStoppageAllowanceObj.dataValues);  // Quick send message at the time of donation
  return addedStoppageAllowanceObj;
};



/**
 * Query for Items
 * @param {Object} filter -  Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryStoppageAllowances = async (filter, options, searchQuery) => {

  let limit = options.pageSize;
  let offset = 0 + (options.pageNumber - 1) * limit;

  searchQuery = searchQuery.toLowerCase();
  const queryFilters = [
    { earning_deduction_type: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('earning_deduction_type')), 'LIKE', '%' + searchQuery + '%') },
  ]


  const { count, rows } = await StoppageAllowanceModel.StoppageAllonceModel.findAndCountAll({
    order: [
      ['createdAt', 'DESC']
    ],
    where: {
      [Op.or]: queryFilters,
      // isActive: true
    },
    offset: offset,
    limit: limit,
  });


  return paginationFacts(count, limit, options.pageNumber, rows);

};

const SP_getAllStoppageAllowanceInfo = async (filter, options, searchQuery,empId) => {
  try {
    console.log("StoppageAllowance section")
    const results = await sequelize.query('CALL usp_GetAllEarningDeductionDetails()');

    let limit = options.pageSize;
    let offset = 0 + (options.pageNumber - 1) * limit;
    searchQuery = searchQuery.toLowerCase();
    let searchlist = filterByValue(results, searchQuery);
    console.log("searchlist", searchlist)
    let count = searchlist.length;
    const rows = searchlist.slice(offset, offset + limit)
    
    return paginationFacts(count, limit, options.pageNumber, rows); // 
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
  }
};


const SP_getAllStoppageAllowanceInfoByEmpId = async (empId) => {
  try {
    console.log("StoppageAllowance empID",empId);
    const results = await sequelize.query('CALL usp_GetAllStoppageAllowancesByEmpId(:employeeId)', {
      replacements: { employeeId: empId || 'null' },
      type: Sequelize.QueryTypes.RAW // Use RAW type for executing stored procedures
    });

    return results;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
  }
};

const SP_GetAllEarningDeductionList = async (flagId) => {
  try {
    console.log("SP_GetAllEarningDeductionList empID",flagId);
    const results = await sequelize.query('CALL usp_GetEarningDeductionResultSet(:flag)', {
      replacements: { flag: flagId || 1 },
      type: Sequelize.QueryTypes.RAW // Use RAW type for executing stored procedures
    });

    return results;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
  }
};

function filterByValue(array, string) {

  if (!string) {
    return array;
  }
  return array.filter(o => Object.keys(o).some(k => {
    return o['StoppageAllowanceCode'].toLowerCase().includes(string.toLowerCase()) || o['StoppageAllowanceName'].toLowerCase().includes(string.toLowerCase())
  }
  )
  );
}



/**
 * Get Item by id
 * @param {ObjectId} id
 * @returns {Promise<ReceiptModel>}
 */
const getStoppageAllowanceById = async (id) => {
  console.log("getStoppageAllowanceById", id)
  return StoppageAllowanceModel.StoppageAllonceModel.findByPk(id);
};



/**
 * Update Item by id
 * @param {ObjectId} ReceiptId
 * @param {Object} updateBody
 * @returns {Promise<ReceiptModel>}
 */
const updateStoppageAllowanceById = async (Id, updateBody, updatedBy) => {

  console.log("zzz", updateBody);
  const Item = await getStoppageAllowanceById(Id);
  if (!Item) {
    throw new ApiError(httpStatus.NOT_FOUND, "record not found");
  }
  //console.log("Update Receipt Id" , item);
  // updateBody.slug = updateBody.name.replace(/ /g, "-").toLowerCase()
  updateBody.updatedBy = updatedBy;
  delete updateBody.id;
  Object.assign(Item, updateBody);
  await Item.save();
  return;
};

/**
 * Delete Item by id
 * @param {ObjectId} Id
 * @returns {Promise<ReceiptModel>}
 */
const deleteStoppageAllowanceById = async (Id) => {

  const Item = await getStoppageAllowanceById(Id);
  if (!Item) {
    throw new ApiError(httpStatus.NOT_FOUND, "Item not found");
  }
  await Item.destroy();
  return Item;
};



module.exports = {
  createStoppageAllowance,
  queryStoppageAllowances,
  getStoppageAllowanceById,
  updateStoppageAllowanceById,
  deleteStoppageAllowanceById,
  SP_getAllStoppageAllowanceInfo,
  SP_getAllStoppageAllowanceInfoByEmpId,
  SP_GetAllEarningDeductionList
};
