const httpStatus = require("http-status");
const axios = require("axios")
const ExperienceModel = require("../../../models/index");
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
 * @param {Object} ExperienceBody
 * @returns {Promise<Experience>}
 */
const createExperience = async (req, ExperienceBody) => {
  console.log("Experience Body", ExperienceBody)
  // ExperienceBody.slug = ExperienceBody.name.replace(/ /g, "-").toLowerCase();
  console.log(req.user.id);
  ExperienceBody.createdBy = req.user.id;
  console.log(ExperienceBody, "body");
  const addedExperienceObj = await ExperienceModel.ExperienceModel.create(ExperienceBody);
  //authSMSSend(addedExperienceObj.dataValues);  // Quick send message at the time of donation
  return addedExperienceObj;
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
const queryExperiences = async (filter, options, searchQuery) => {

  let limit = options.pageSize;
  let offset = 0 + (options.pageNumber - 1) * limit;

  searchQuery = searchQuery.toLowerCase();
  const queryFilters = [
    { institutionId: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('institutionId')), 'LIKE', '%' + searchQuery + '%') },
  ]


  const { count, rows } = await ExperienceModel.ExperienceModel.findAndCountAll({
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

const SP_getAllExperiencesInfo = async (filter, options, searchQuery, empId) => {
  try {
    console.log("SP_getAllExperiencesInfo", empId || 'null')
    //const test = empId || 'null'
    const results = await sequelize.query('CALL usp_GetAllEmployeeWorkExperience(:employeeId)', {
      replacements: { employeeId: empId || 'null' },
      type: Sequelize.QueryTypes.RAW // Use RAW type for executing stored procedures
    });

    console.log("searchQuery", searchQuery)
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


const SP_getAllExperiencesInfoByEmpId = async (empId) => {
  try {
    console.log("SP_getAllExperiencesInfo", empId || 'null')
    //const test = empId || 'null'
    const results = await sequelize.query('CALL usp_GetAllEmployeeWorkExperience(:employeeId)', {
      replacements: { employeeId: empId || 'null' },
      type: Sequelize.QueryTypes.RAW // Use RAW type for executing stored procedures
    });

    //  console.log("searchQuery",searchQuery)
    //   let limit = options.pageSize;
    //   let offset = 0 + (options.pageNumber - 1) * limit;
    //   searchQuery = searchQuery.toLowerCase();
    //   let searchlist = filterByValue(results, searchQuery);
    //   console.log("searchlist", searchlist)
    //   let count = searchlist.length;
    //   const rows = searchlist.slice(offset, offset + limit)
    console.log("jkl", results)
    return results; //paginationFacts(count, limit, options.pageNumber, rows); // 
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
  }
};

function filterByValue(array, string) {

  if (!string) {
    return array;
  }
  return array.filter(o => Object.keys(o).some(k => {
    return o['companyName'].toLowerCase().includes(string.toLowerCase()) || o['employee'].toLowerCase().includes(string.toLowerCase()) || o['positionHeld'].toLowerCase().includes(string.toLowerCase())
  }
  )
  );
}



/**
 * Get Item by id
 * @param {ObjectId} id
 * @returns {Promise<ReceiptModel>}
 */
const getExperienceById = async (id) => {
  console.log("getExperienceById", id)
  return ExperienceModel.ExperienceModel.findByPk(id);
};


const getAllEmployeeExperienceByEmpId = async (id) => {
  console.log("employee id " + id)
  const queryFilters = [
    { employeeId: id },
  ]
  return ExperienceModel.ExperienceModel.findAndCountAll({
    order: [
      ['createdAt', 'DESC']
    ],
    where: {
      [Op.or]: queryFilters,
      isActive: true
    },
    offset: 0,
    limit: 10,
  });
};


/**
 * Update Item by id
 * @param {ObjectId} ReceiptId
 * @param {Object} updateBody
 * @returns {Promise<ReceiptModel>}
 */
const updateExperienceById = async (Id, updateBody, updatedBy) => {

  console.log("zzz", updateBody);
  const Item = await getExperienceById(Id);
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
const deleteExperienceById = async (Id) => {

  const Item = await getExperienceById(Id);
  if (!Item) {
    throw new ApiError(httpStatus.NOT_FOUND, "Item not found");
  }
  await Item.destroy();
  return Item;
};



module.exports = {
  createExperience,
  queryExperiences,
  getExperienceById,
  updateExperienceById,
  deleteExperienceById,
  SP_getAllExperiencesInfo,
  getAllEmployeeExperienceByEmpId,
  SP_getAllExperiencesInfoByEmpId
};
