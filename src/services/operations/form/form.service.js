const httpStatus = require("http-status");
const axios = require("axios")
const FormModel = require("../../../models/index");
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
 * @param {Object} FormBody
 * @returns {Promise<Bank>}
 */
const createForm = async (req, FormBody) => {
  console.log("Form Body", FormBody)
  // FormBody.slug = FormBody.name.replace(/ /g, "-").toLowerCase();
  console.log(req.user.id);
  FormBody.createdBy = req.user.id;
  FormBody.formName = FormBody.formName;

  FormBody.parentFormID = FormBody.parentFormID || null;
  console.log(FormBody, "else");
  const addedFormObj = await FormModel.FormModel.create(FormBody);
  //authSMSSend(addedBankObj.dataValues);  // Quick send message at the time of donation
  return addedFormObj;
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
const queryForm = async (filter, options, searchQuery) => {
  console.log("get search query", searchQuery);

  console.log("options Form", options);
  let limit = options.pageSize;
  let offset = 0 + (options.pageNumber - 1) * limit;
  console.log("frm offset ", offset)
  searchQuery = searchQuery.toLowerCase();
  const queryFilters = [
    // { isActive: sequelize.where }
    // { Id: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('Id')), 'LIKE', '%' + searchQuery + '%') },
    { formName: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('formName')), 'LIKE', '%' + searchQuery + '%') },
    { formCode: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('formName')), 'LIKE', '%' + searchQuery + '%') },

  ]
  const { count, rows } = await FormModel.FormModel.findAndCountAll({
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

  console.log("counter", count)
  console.log("rows", rows);

  return paginationFacts(count, limit, options.pageNumber, rows);
  // return Items;
};

/**
 * Get Item by id
 * @param {ObjectId} id
 * @returns {Promise<ReceiptModel>}
 */
const getFormById = async (id) => {
  //console.log("read receipt by id " + id)
  return FormModel.FormModel.findByPk(id);
};

/**
 * Update Item by id
 * @param {ObjectId} ReceiptId
 * @param {Object} updateBody
 * @returns {Promise<ReceiptModel>}
 */
const updateFormById = async (Id, updateBody, updatedBy) => {
  //console.log("item 12")

  const Item = await getFormById(Id);
  //console.log(item)
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
const deleteFormById = async (Id) => {

  console.log("delete form id",Id)
  const Item = await getFormById(Id);
  if (!Item) {
    throw new ApiError(httpStatus.NOT_FOUND, "Item not found");
  }
  await Item.destroy();
  return Item;
};

function filterByValue(array, string) {

  if (!string) {
    return array;
  }
  return array.filter(o => Object.keys(o).some(k => {
    return o['formCode']?.toLowerCase().includes(string?.toLowerCase()) || o['formName']?.toLowerCase().includes(string?.toLowerCase()) || o['MenuName']?.toLowerCase().includes(string?.toLowerCase())
  }
  )
  );
}

const getAllParentChildForms = async (filter, options, searchQuery) => {
  try {

    const results = await sequelize.query('CALL sp_getAllParentChildeMenus()');
    console.log(results, "res", searchQuery)
    let limit = options.pageSize;
    let offset = 0 + (options.pageNumber - 1) * limit;
    searchQuery = searchQuery.toLowerCase();
    let searchlist = filterByValue(results, searchQuery);
    console.log("searchlist", searchlist)
    let count = searchlist.length;
    const rows = searchlist; //searchlist.slice(offset, offset + limit)

    return paginationFacts(count, limit, options.pageNumber, rows); // 
  } catch (error) {
    console.log('::::::error::::::',error);
    
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Error calling stored procedure");
  }
};



const getAllChildForms = async (id) => {
  try {

   // const results = await sequelize.query('exec usp_GetAllChildFormById(:param1)',{replacements:{ parentMenuId: 1 },transaction: param});
   
   const parentMenuId = id; // Example parameter value
   console.log("parentId",id);
   const results = await sequelize.query('call usp_GetAllChildFormById(:parentMenuId)', {
     replacements: { parentMenuId },
     type: Sequelize.QueryTypes.RAW // Use RAW type for executing stored procedures
   });
   
    console.log("totalList1",results)
    let limit = 100; // options.pageSize;
    //let offset = 0 + (options.pageNumber - 1) * limit;
    
    //searchQuery = searchQuery.toLowerCase();
    //let searchlist = filterByValue(results, searchQuery);
    //console.log("child list", searchlist)
    let count = results.length;
    //const rows = searchlist.slice(offset, offset + limit)
    console.log("test")
    return paginationFacts(count, limit, parentMenuId, results); // 
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
  }
};


module.exports = {
  createForm,
  queryForm,
  getFormById,
  updateFormById,
  deleteFormById,
  getAllParentChildForms,
  getAllChildForms

};
