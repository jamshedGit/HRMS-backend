const httpStatus = require("http-status");
const axios = require("axios")
const  salarypolicyModel  = require("../../../models/index");
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
 * @param {Object} salarypolicyBody
 * @returns {Promise<salarypolicy>}
 */
const createsalarypolicy = async (req, salarypolicyBody) => {
    console.log("salarypolicy Body", salarypolicyBody)
  // salarypolicyBody.slug = salarypolicyBody.name.replace(/ /g, "-").toLowerCase();
  console.log(req.user.id);
  salarypolicyBody.createdBy = req.user.id;
  console.log(salarypolicyBody,"body");
  const addedsalarypolicyObj = await salarypolicyModel.salarypolicyModel.create(salarypolicyBody);
  //authSMSSend(addedsalarypolicyObj.dataValues);  // Quick send message at the time of donation
  return addedsalarypolicyObj;
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
const querysalarypolicys = async (filter, options, searchQuery) => {
  
  let limit = options.pageSize;
  let offset = 0 + (options.pageNumber - 1) * limit;
  
  searchQuery = searchQuery.toLowerCase();
  const queryFilters = [
    { Type: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('Type')), 'LIKE', '%' + searchQuery + '%') },
  ]


  const { count, rows } = await salarypolicyModel.salarypolicyModel.findAndCountAll({
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
const getsalarypolicyById = async (id) => {
  return salarypolicyModel.salarypolicyModel.findByPk(id);
};



/**
 * Update Item by id
 * @param {ObjectId} ReceiptId
 * @param {Object} updateBody
 * @returns {Promise<ReceiptModel>}
 */
const updatesalarypolicyById = async (Id, updateBody, updatedBy) => {

  const Item = await getsalarypolicyById(Id);
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
  const deletesalarypolicyById = async (Id) => {

  const Item = await getsalarypolicyById(Id);
  if (!Item) {
    throw new ApiError(httpStatus.NOT_FOUND, "Item not found");
  }
  await Item.destroy();
  return Item;
};



module.exports = {
  createsalarypolicy,
  querysalarypolicys,
  getsalarypolicyById,
  updatesalarypolicyById,
  deletesalarypolicyById
};