const httpStatus = require("http-status");
const axios = require("axios")
const  AcademicModel  = require("../../../models/index");
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
 * @param {Object} AcademicBody
 * @returns {Promise<Academic>}
 */
const createAcademic = async (req, AcademicBody) => {
    console.log("Academic Body", AcademicBody)
  // AcademicBody.slug = AcademicBody.name.replace(/ /g, "-").toLowerCase();
  console.log(req.user.id);
  AcademicBody.createdBy = req.user.id;
  console.log(AcademicBody,"body");
  const addedAcademicObj = await AcademicModel.AcademicModel.create(AcademicBody);
  //authSMSSend(addedAcademicObj.dataValues);  // Quick send message at the time of donation
  return addedAcademicObj;
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
const queryAcademics = async (filter, options, searchQuery) => {
  
  let limit = options.pageSize;
  let offset = 0 + (options.pageNumber - 1) * limit;
  
  searchQuery = searchQuery.toLowerCase();
  const queryFilters = [
    { institutionId: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('institutionId')), 'LIKE', '%' + searchQuery + '%') },
  ]


  const { count, rows } = await AcademicModel.AcademicModel.findAndCountAll({
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

const SP_getAllAcademicsInfo = async (filter, options, searchQuery,empId) => {
  try {
   
    const results = await sequelize.query('CALL usp_GetAllAcademicInfo(:employeeId)', {
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
    console.log("rows",rows)
    return paginationFacts(count, limit, options.pageNumber, rows); // 
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
  }
};


const SP_getAllAcademicsInfoByEmpId = async (empId) => {
  try {
    console.log("jazz",empId);
    const results = await sequelize.query('CALL usp_GetAllAcademicInfo(:employeeId)', {
      replacements: { employeeId: empId || 'null' },
      type: Sequelize.QueryTypes.RAW // Use RAW type for executing stored procedures
    });
   
    console.log("mj",results);
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
    return o['institution'].toLowerCase().includes(string.toLowerCase()) || o['employee'].toLowerCase().includes(string.toLowerCase()) || o['status'].toLowerCase().includes(string.toLowerCase())
  }
  )
  );
}

/**
 * Get Item by id
 * @param {ObjectId} id
 * @returns {Promise<ReceiptModel>}
 */
const getAcademicById = async (id) => {
  console.log("getAcademicById", id)
  return AcademicModel.AcademicModel.findByPk(id);
};



/**
 * Update Item by id
 * @param {ObjectId} ReceiptId
 * @param {Object} updateBody
 * @returns {Promise<ReceiptModel>}
 */
const updateAcademicById = async (Id, updateBody, updatedBy) => {

  console.log("zzz",updateBody);
  const Item = await getAcademicById(Id);
  if (!Item) {
    throw new ApiError(httpStatus.NOT_FOUND, "record not found");
  }
  //console.log("Update Receipt Id" , item);
  // updateBody.slug = updateBody.name.replace(/ /g, "-").toLowerCase()
  updateBody.updatedBy = updatedBy;
  delete updateBody.id;
  Object.assign(Item, updateBody);
  await Item.save();
  return  ;
};

/**
 * Delete Item by id
 * @param {ObjectId} Id
 * @returns {Promise<ReceiptModel>}
 */
  const deleteAcademicById = async (Id) => {

  const Item = await getAcademicById(Id);
  if (!Item) {
    throw new ApiError(httpStatus.NOT_FOUND, "Item not found");
  }
  await Item.destroy();
  return Item;
};



module.exports = {
  createAcademic,
  queryAcademics,
  getAcademicById,
  updateAcademicById,
  deleteAcademicById,
  SP_getAllAcademicsInfo,
  SP_getAllAcademicsInfoByEmpId
};
