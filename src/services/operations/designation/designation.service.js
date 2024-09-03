const httpStatus = require("http-status");
const axios = require("axios")
const DesignationModel = require("../../../models/index");
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
 * @param {Object} DesignationBody
 * @returns {Promise<Bank>}
 */
const createDesignation = async (req, DesignationBody) => {
  console.log("Designation Body", DesignationBody)
  // DesignationBody.slug = DesignationBody.name.replace(/ /g, "-").toLowerCase();
  console.log(req.user.id);
  DesignationBody.createdBy = req.user.id;
  DesignationBody.bankName = DesignationBody.Name;
  console.log(DesignationBody, "body");
  const addedDesignationObj = await DesignationModel.DesignationModel.create(DesignationBody);
  //authSMSSend(addedBankObj.dataValues);  // Quick send message at the time of donation
  return addedDesignationObj;
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
const queryDesignation = async (filter, options, searchQuery) => {
  console.log("get search query", searchQuery);

  console.log("options Designation", options);
  let limit = options.pageSize;
  let offset = 0 + (options.pageNumber - 1) * limit;
  console.log("designationCode offset ", offset)
  searchQuery = searchQuery.toLowerCase();
  const queryFilters = [
    // { isActive: sequelize.where }
    // { Id: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('Id')), 'LIKE', '%' + searchQuery + '%') },
    { designationName: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('designationName')), 'LIKE', '%' + searchQuery + '%') },
    { designationCode: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('designationCode')), 'LIKE', '%' + searchQuery + '%') },

  ]


  const { count, rows } = await DesignationModel.DesignationModel.findAndCountAll({
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
const getDesignationById = async (id) => {
  //console.log("read receipt by id " + id)
  return DesignationModel.DesignationModel.findByPk(id);
};



/**
 * Update Item by id
 * @param {ObjectId} ReceiptId
 * @param {Object} updateBody
 * @returns {Promise<ReceiptModel>}
 */
const updateDesignationById = async (Id, updateBody, updatedBy) => {
  //console.log("item 12")

  const Item = await getDesignationById(Id);
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
const deleteDesignationById = async (Id) => {

  const Item = await getDesignationById(Id);
  if (!Item) {
    throw new ApiError(httpStatus.NOT_FOUND, "Item not found");
  }
  await Item.destroy();
  return Item;
};



module.exports = {
  createDesignation,
  queryDesignation,
  getDesignationById,
  updateDesignationById,
  deleteDesignationById
};
