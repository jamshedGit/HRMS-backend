const httpStatus = require("http-status");
const axios = require("axios")
const ExchangeRateModel = require("../../../models/index");
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
 * @param {Object} ExchangeRateBody
 * @returns {Promise<ExchangeRate>}
 */
const createExchangeRate = async (req, ExchangeRateBody) => {
  console.log("ExchangeRate Body", ExchangeRateBody)
  // ExchangeRateBody.slug = ExchangeRateBody.name.replace(/ /g, "-").toLowerCase();
  console.log(req.user.id);
  ExchangeRateBody.createdBy = req.user.id;
  console.log(ExchangeRateBody, "body");
  const addedExchangeRateObj = await ExchangeRateModel.ExchangeRateModel.create(ExchangeRateBody);
  //authSMSSend(addedExchangeRateObj.dataValues);  // Quick send message at the time of donation
  return addedExchangeRateObj;
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
const queryExchangeRates = async (filter, options, searchQuery) => {

  let limit = options.pageSize;
  let offset = 0 + (options.pageNumber - 1) * limit;

  searchQuery = searchQuery.toLowerCase();
  const queryFilters = [
    { earning_deduction_type: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('earning_deduction_type')), 'LIKE', '%' + searchQuery + '%') },
  ]


  const { count, rows } = await ExchangeRateModel.ExchangeRateModel.findAndCountAll({
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

const SP_getAllExchangeRateInfo = async (filter, options, searchQuery,empId) => {
  try {
    console.log("ExchangeRate section")
    const results = await sequelize.query('CALL usp_GetAllCurrecnyExchangeRate()');

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


const SP_getAllExchangeRateInfoByEmpId = async (empId) => {
  try {
    console.log("ExchangeRate empID",empId);
    const results = await sequelize.query('CALL usp_GetAllExchangeRatesByEmpId(:employeeId)', {
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
    return o['Base_Currency'].toLowerCase().includes(string.toLowerCase()) || o['Subsidiary'].toLowerCase().includes(string.toLowerCase())
  }
  )
  );
}



/**
 * Get Item by id
 * @param {ObjectId} id
 * @returns {Promise<ReceiptModel>}
 */
const getExchangeRateById = async (id) => {
  console.log("getExchangeRateById", id)
  return ExchangeRateModel.ExchangeRateModel.findByPk(id);
};



/**
 * Update Item by id
 * @param {ObjectId} ReceiptId
 * @param {Object} updateBody
 * @returns {Promise<ReceiptModel>}
 */
const updateExchangeRateById = async (Id, updateBody, updatedBy) => {

  console.log("zzz", updateBody);
  const Item = await getExchangeRateById(Id);
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
const deleteExchangeRateById = async (Id) => {

  const Item = await getExchangeRateById(Id);
  if (!Item) {
    throw new ApiError(httpStatus.NOT_FOUND, "Item not found");
  }
  await Item.destroy();
  return Item;
};



module.exports = {
  createExchangeRate,
  queryExchangeRates,
  getExchangeRateById,
  updateExchangeRateById,
  deleteExchangeRateById,
  SP_getAllExchangeRateInfo,
  SP_getAllExchangeRateInfoByEmpId,
  SP_GetAllEarningDeductionList
};
