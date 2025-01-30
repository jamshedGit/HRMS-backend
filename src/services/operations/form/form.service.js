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
 
  // FormBody.slug = FormBody.name.replace(/ /g, "-").toLowerCase();
try{
  FormBody.createdBy = req.user.Id;
  FormBody.formName = FormBody.formName;
  FormBody.companyId=req.user.companyId;
  FormBody.parentFormID = FormBody.parentFormID || null;

  const addedFormObj = await FormModel.FormModel.create(FormBody);
  //authSMSSend(addedBankObj.dataValues);  // Quick send message at the time of donation

    return addedFormObj;
   
} catch (error) {
  throw error   
}

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
 


  let limit = options.pageSize;
  let offset = 0 + (options.pageNumber - 1) * limit;

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




  return paginationFacts(count, limit, options.pageNumber, rows);
  // return Items;
};

/**
 * Get Item by id
 * @param {ObjectId} id
 * @returns {Promise<ReceiptModel>}
 */
const getFormById = async (id) => {

  return FormModel.FormModel.findByPk(id);
};

/**
 * Update Item by id
 * @param {ObjectId} ReceiptId
 * @param {Object} updateBody
 * @returns {Promise<ReceiptModel>}
 */
const updateFormById = async (Id, updateBody, updatedBy) => {


  const Item = await getFormById(Id);

  if (!Item) {
    throw new ApiError(httpStatus.NOT_FOUND, "record not found");
  }

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

    let limit = options.pageSize;
    let offset = 0 + (options.pageNumber - 1) * limit;
    searchQuery = searchQuery.toLowerCase();
    let searchlist = filterByValue(results, searchQuery);
 
    let count = searchlist.length;
    // const rows =searchlist.slice(offset, offset + limit)
    const rows = searchlist; //searchlist.slice(offset, offset + limit)

    return paginationFacts(count, limit, options.pageNumber, rows); // 
  } catch (error) {
    
    
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Error calling stored procedure");
  }
};



const getAllChildForms = async (req,id) => {
  try {

   // const results = await sequelize.query('exec usp_GetAllChildFormById(:param1)',{replacements:{ parentMenuId: 1 },transaction: param});

   const parentMenuId = id; // Example parameter value

  //  const results = await sequelize.query('call usp_GetAllChildFormById(:parentMenuId)', {
  //    replacements: { parentMenuId },
  //    type: Sequelize.QueryTypes.RAW // Use RAW type for executing stored procedures
  //  });

//I have updated only this line of code instead of the entire procedure.
  const results=await FormModel.FormModel.findAll({
    where:{
      parentFormId:parentMenuId,
      companyId:req.user.companyId
    }
  })

  
    let limit = 100; // options.pageSize;
    //let offset = 0 + (options.pageNumber - 1) * limit;
    
    //searchQuery = searchQuery.toLowerCase();
    //let searchlist = filterByValue(results, searchQuery);
   
    let count = results.length;
    //const rows = searchlist.slice(offset, offset + limit)
  
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
