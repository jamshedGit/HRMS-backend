const httpStatus = require("http-status");
const axios = require("axios")
const CompensationExpatriateModel = require("../../../models/index");
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
 * @param {Object} CompensationExpatriateBody
 * @returns {Promise<CompensationExpatriate>}
 */
const createCompensationExpatriate = async (req, CompensationExpatriateBody) => {
  console.log("CompensationExpatriate Body", CompensationExpatriateBody)
  // CompensationExpatriateBody.slug = CompensationExpatriateBody.name.replace(/ /g, "-").toLowerCase();
  console.log(req.user.id);
  CompensationExpatriateBody.createdBy = req.user.id;
  console.log(CompensationExpatriateBody, "body");
  const addedCompensationExpatriateObj = await CompensationExpatriateModel.CompensationExpatriateModel.create(CompensationExpatriateBody);
  //authSMSSend(addedCompensationExpatriateObj.dataValues);  // Quick send message at the time of donation
  return addedCompensationExpatriateObj;
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
const queryCompensationExpatriates = async (filter, options, searchQuery) => {

  let limit = options.pageSize;
  let offset = 0 + (options.pageNumber - 1) * limit;

  searchQuery = searchQuery.toLowerCase();
  const queryFilters = [
    { skill: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('skill')), 'LIKE', '%' + searchQuery + '%') },
  ]


  const { count, rows } = await CompensationExpatriateModel.CompensationExpatriateModel.findAndCountAll({
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

const SP_getAllCompensationExpatriateInfo = async (filter, options, searchQuery,empId,transactionType) => {
  try {
    console.log("transactionType",transactionType)
    const results = await sequelize.query('CALL usp_GetAllCompensationExpatriateDetails()')
    
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


const SP_getAllCompensationExpatriateInfoByEmpId = async (empId,transactionType) => {
  try {
    console.log("CompensationExpatriate empID",empId);
    const results = await sequelize.query('CALL usp_GetAllActiveEmployeeSalaries(:id,:transactionType)', {
      replacements: { id: empId || 'null',transactionType: transactionType  },
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
    return o['CompensationExpatriateCode'].toLowerCase().includes(string.toLowerCase()) || o['CompensationExpatriateName'].toLowerCase().includes(string.toLowerCase())
  }
  )
  );
}



/**
 * Get Item by id
 * @param {ObjectId} id
 * @returns {Promise<ReceiptModel>}
 */
const getCompensationExpatriateById = async (id) => {
  console.log("employee_salary_service2", id)
  return CompensationExpatriateModel.CompensationExpatriateModel.findByPk(id);
};



/**
 * Update Item by id
 * @param {ObjectId} ReceiptId
 * @param {Object} updateBody
 * @returns {Promise<ReceiptModel>}
 */
const updateCompensationExpatriateById = async (Id, updateBody, updatedBy) => {

  console.log("expat pdate",Id, updateBody,updatedBy);
  const Item = await getCompensationExpatriateById(Id);
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
const deleteCompensationExpatriateById = async (Id) => {
  console.log("delete tran",Id);
  const Item = await getCompensationExpatriateById(Id);
  if (!Item) {
    throw new ApiError(httpStatus.NOT_FOUND, "Item not found");
  }
  await Item.destroy();
  return Item;
};



module.exports = {
  createCompensationExpatriate,
  queryCompensationExpatriates,
  getCompensationExpatriateById,
  updateCompensationExpatriateById,
  deleteCompensationExpatriateById,
  SP_getAllCompensationExpatriateInfo,
  SP_getAllCompensationExpatriateInfoByEmpId
};
