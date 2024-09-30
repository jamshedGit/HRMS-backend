const httpStatus = require("http-status");
const axios = require("axios")
const  TaxSetupModel  = require("../../../models/index");
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
 * @param {Object} TaxSetupBody
 * @returns {Promise<TaxSetup>}
 */
const createTaxSetup = async (req, TaxSetupBody) => {
    console.log("TaxSetup Body", TaxSetupBody)
  // TaxSetupBody.slug = TaxSetupBody.name.replace(/ /g, "-").toLowerCase();
  console.log(req.user.id);
  TaxSetupBody.createdBy = req.user.id;
  console.log(TaxSetupBody,"body");
  const resp = await sequelize.query(' update t_tax_setup set isActive = 0');

  const addedTaxSetupObj = await TaxSetupModel.TaxSetupModel.create(TaxSetupBody);
  //authSMSSend(addedTaxSetupObj.dataValues);  // Quick send message at the time of donation
  return addedTaxSetupObj;
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
const queryTaxSetups = async (filter, options, searchQuery) => {
  
  let limit = options.pageSize;
  let offset = 0 + (options.pageNumber - 1) * limit;
  
  searchQuery = searchQuery.toLowerCase();
  const queryFilters = [
    { Name: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('startDate')), 'LIKE', '%' + searchQuery + '%') },
  ]


  const { count, rows } = await TaxSetupModel.TaxSetupModel.findAndCountAll({
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

/**
 * Get Item by id
 * @param {ObjectId} id
 * @returns {Promise<ReceiptModel>}
 */
const getTaxSetupById = async (id) => {
  return TaxSetupModel.TaxSetupModel.findByPk(id);
};



/**
 * Update Item by id
 * @param {ObjectId} ReceiptId
 * @param {Object} updateBody
 * @returns {Promise<ReceiptModel>}
 */
const updateTaxSetupById = async (Id, updateBody, updatedBy) => {
  console.log("tool",Id, updateBody, updatedBy)
  const Item = await getTaxSetupById(Id);
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
  const deleteTaxSetupById = async (Id) => {

  const Item = await getTaxSetupById(Id);
  if (!Item) {
    throw new ApiError(httpStatus.NOT_FOUND, "Item not found");
  }
  await Item.destroy();
  return Item;
};



module.exports = {
  createTaxSetup,
  queryTaxSetups,
  getTaxSetupById,
  updateTaxSetupById,
  deleteTaxSetupById
};
