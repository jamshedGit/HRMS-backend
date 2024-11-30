const httpStatus = require("http-status");
const axios = require("axios")
const LoanTypeModel = require("../../../models/index");
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
 * @param {Object} LoanTypeBody
 * @returns {Promise<LoanType>}
 */
const createLoanType = async (req, LoanTypeBody) => {
  console.log("LoanType Body", LoanTypeBody)
  // LoanTypeBody.slug = LoanTypeBody.name.replace(/ /g, "-").toLowerCase();
  console.log(req.user.id);
  LoanTypeBody.createdBy = req.user.id;
  console.log(LoanTypeBody, "body");
  const addedLoanTypeObj = await LoanTypeModel.LoanTypeModel.create(LoanTypeBody);
  //authSMSSend(addedLoanTypeObj.dataValues);  // Quick send message at the time of donation
  return addedLoanTypeObj;
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
const queryLoanTypes = async (filter, options, searchQuery) => {

  let limit = options.pageSize;
  let offset = 0 + (options.pageNumber - 1) * limit;

  searchQuery = searchQuery.toLowerCase();
  const queryFilters = [
    { skill: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('name')), 'LIKE', '%' + searchQuery + '%') },
  ]


  const { count, rows } = await LoanTypeModel.LoanTypeModel.findAndCountAll({
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

const SP_getAllLoanTypeInfo = async (filter, options, searchQuery,empId) => {
  try {
    console.log("LoanType section")
    const results = await sequelize.query('CALL usp_GetAllLoanTypesByEmpId(:employeeId)', {
      replacements: { employeeId: empId || 'null' },
      type: Sequelize.QueryTypes.RAW // Use RAW type for executing stored procedures
    });

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


const SP_getAllLoanTypeInfoByEmpId = async (empId) => {
  try {
    console.log("LoanType empID",empId);
    const results = await sequelize.query('CALL usp_GetAllLoanTypesByEmpId(:employeeId)', {
      replacements: { employeeId: empId || 'null' },
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
    return o['LoanTypeCode'].toLowerCase().includes(string.toLowerCase()) || o['LoanTypeName'].toLowerCase().includes(string.toLowerCase())
  }
  )
  );
}



/**
 * Get Item by id
 * @param {ObjectId} id
 * @returns {Promise<ReceiptModel>}
 */
const getLoanTypeById = async (id) => {
  console.log("getLoanTypeById", id)
  return LoanTypeModel.LoanTypeModel.findByPk(id);
};



/**
 * Update Item by id
 * @param {ObjectId} ReceiptId
 * @param {Object} updateBody
 * @returns {Promise<ReceiptModel>}
 */
const updateLoanTypeById = async (Id, updateBody, updatedBy) => {

  console.log("zzz", updateBody);
  const Item = await getLoanTypeById(Id);
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
const deleteLoanTypeById = async (Id) => {

  const Item = await getLoanTypeById(Id);
  if (!Item) {
    throw new ApiError(httpStatus.NOT_FOUND, "Item not found");
  }
  await Item.destroy();
  return Item;
};



module.exports = {
  createLoanType,
  queryLoanTypes,
  getLoanTypeById,
  updateLoanTypeById,
  deleteLoanTypeById,
  SP_getAllLoanTypeInfo,
  SP_getAllLoanTypeInfoByEmpId
};
