const httpStatus = require("http-status");
const axios = require("axios")
const EarningModel = require("../../models/index");
const ApiError = require("../../utils/ApiError");
const sequelize = require("../../config/db");
const Sequelize = require('sequelize');
const { paginationFacts } = require("../../utils/common");
const https = require('https');
const { XMLParser, XMLBuilder, XMLValidator } = require("fast-xml-parser");
const fns = require('date-fns')

const Op = Sequelize.Op;
/**
 * Create a Item
 * @param {Object} EarningBody
 * @returns {Promise<Earning>}
 */
const createEarning = async (req, EarningBody) => {
  console.log("Earning Body", EarningBody)
  // EarningBody.slug = EarningBody.name.replace(/ /g, "-").toLowerCase();
  console.log(req.user.id);
  EarningBody.createdBy = req.user.id;
  console.log(EarningBody, "body");
  const addedEarningObj = await EarningModel.EarningModel.create(EarningBody);
  //authSMSSend(addedEarningObj.dataValues);  // Quick send message at the time of donation
  return addedEarningObj;
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
const queryEarnings = async (filter, options, searchQuery) => {

  let limit = options.pageSize;
  let offset = 0 + (options.pageNumber - 1) * limit;

  searchQuery = searchQuery.toLowerCase();
  const queryFilters = [
    { skill: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('skill')), 'LIKE', '%' + searchQuery + '%') },
  ]


  const { count, rows } = await EarningModel.EarningModel.findAndCountAll({
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

const SP_getAllEarningInfo = async (filter, options, searchQuery,empId) => {
  try {
    console.log("earning empId",empId)
    const results = await sequelize.query('CALL usp_GetAllEmpEarnings(:employeeId)', {
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


const SP_getAllEarningInfoByEmpId = async (empId) => {
  try {
    console.log("Earning empID",empId);
    const results = await sequelize.query('CALL usp_GetAllEmployeeEarningDetails(:employeeId)', {
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
    return o['earningCode'].toLowerCase().includes(string.toLowerCase()) || o['earningName'].toLowerCase().includes(string.toLowerCase())
  }
  )
  );
}



/**
 * Get Item by id
 * @param {ObjectId} id
 * @returns {Promise<ReceiptModel>}
 */
const getEarningById = async (id) => {
  console.log("getEarningById", id)
  return EarningModel.EarningModel.findByPk(id);
};



/**
 * Update Item by id
 * @param {ObjectId} ReceiptId
 * @param {Object} updateBody
 * @returns {Promise<ReceiptModel>}
 */
const updateEarningById = async (Id, updateBody, updatedBy) => {

  console.log("zzz", updateBody);
  const Item = await getEarningById(Id);
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
const deleteEarningById = async (Id) => {

  const Item = await getEarningById(Id);
  if (!Item) {
    throw new ApiError(httpStatus.NOT_FOUND, "Item not found");
  }
  await Item.destroy();
  return Item;
};



module.exports = {
  createEarning,
  queryEarnings,
  getEarningById,
  updateEarningById,
  deleteEarningById,
  SP_getAllEarningInfo,
  SP_getAllEarningInfoByEmpId
};
