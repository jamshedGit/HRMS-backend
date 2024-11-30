const httpStatus = require("http-status");
const axios = require("axios")
const IncidentModel = require("../../../models/index");
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
 * @param {Object} IncidentBody
 * @returns {Promise<Incident>}
 */
const createIncident = async (req, IncidentBody) => {
  console.log("Incident Body", IncidentBody)
  // IncidentBody.slug = IncidentBody.name.replace(/ /g, "-").toLowerCase();
  console.log(req.user.id);
  IncidentBody.createdBy = req.user.id;
  console.log(IncidentBody, "body");
  const addedIncidentObj = await IncidentModel.IncidentModel.create(IncidentBody);
  //authSMSSend(addedIncidentObj.dataValues);  // Quick send message at the time of donation
  return addedIncidentObj;
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
const queryIncidents = async (filter, options, searchQuery) => {

  let limit = options.pageSize;
  let offset = 0 + (options.pageNumber - 1) * limit;

  searchQuery = searchQuery.toLowerCase();
  const queryFilters = [
    { skill: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('skill')), 'LIKE', '%' + searchQuery + '%') },
  ]


  const { count, rows } = await IncidentModel.IncidentModel.findAndCountAll({
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

const SP_getAllIncidentInfo = async (filter, options, searchQuery,empId) => {
  try {

    const results = await sequelize.query('CALL usp_GetAllEmployeeIncidentDetails(:employeeId)', {
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


const SP_getAllIncidentInfoByEmpId = async (empId) => {
  try {
    console.log("incident empID",empId);
    const results = await sequelize.query('CALL usp_GetAllEmployeeIncidentDetails(:employeeId)', {
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
    return o['actionTaken'].toLowerCase().includes(string.toLowerCase()) || o['employee'].toLowerCase().includes(string.toLowerCase())
  }
  )
  );
}



/**
 * Get Item by id
 * @param {ObjectId} id
 * @returns {Promise<ReceiptModel>}
 */
const getIncidentById = async (id) => {
  console.log("getIncidentById", id)
  return IncidentModel.IncidentModel.findByPk(id);
};



/**
 * Update Item by id
 * @param {ObjectId} ReceiptId
 * @param {Object} updateBody
 * @returns {Promise<ReceiptModel>}
 */
const updateIncidentById = async (Id, updateBody, updatedBy) => {

  console.log("zzz", updateBody);
  const Item = await getIncidentById(Id);
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
const deleteIncidentById = async (Id) => {

  const Item = await getIncidentById(Id);
  if (!Item) {
    throw new ApiError(httpStatus.NOT_FOUND, "Item not found");
  }
  await Item.destroy();
  return Item;
};



module.exports = {
  createIncident,
  queryIncidents,
  getIncidentById,
  updateIncidentById,
  deleteIncidentById,
  SP_getAllIncidentInfo,
  SP_getAllIncidentInfoByEmpId
};
