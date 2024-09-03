const httpStatus = require("http-status");
const axios = require("axios")
const BranchModel = require("../../../models/index");
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
 * @param {Object} BranchBody
 * @returns {Promise<Bank>}
 */
const createBranch = async (req, BranchBody) => {
  console.log("Branch Body", BranchBody)
  // BranchBody.slug = BranchBody.name.replace(/ /g, "-").toLowerCase();
  console.log(req.user.id);
  BranchBody.createdBy = req.user.id;
  BranchBody.bankName = BranchBody.Name;
  console.log(BranchBody, "body");
  const addedBranchObj = await BranchModel.BranchModel.create(BranchBody);
  //authSMSSend(addedBankObj.dataValues);  // Quick send message at the time of donation
  return addedBranchObj;
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
const queryBranch = async (filter, options, searchQuery) => {
  console.log("get search query", searchQuery);

  console.log("options branch", options);
  let limit = options.pageSize;
  let offset = 0 + (options.pageNumber - 1) * limit;  
  console.log("receipt offset ", offset)
  searchQuery = searchQuery.toLowerCase();
  const queryFilters = [
    // { isActive: sequelize.where }
    // { Id: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('Id')), 'LIKE', '%' + searchQuery + '%') },
     { Name: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('bank.Name')), 'LIKE', '%' + searchQuery + '%') },
    { bankName: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('bankName')), 'LIKE', '%' + searchQuery + '%') },

  ]


  const { count, rows } = await BranchModel.BranchModel.findAndCountAll({
    order: [
      ['createdAt', 'DESC']
    ],
    where: {
      [Op.or]: queryFilters,
      // isActive: true
    },
    include: [
      {
        model: BranchModel.BankModel,
        as: 'bank',
       
        attributes: ['Id', 'Name'],
      }],
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
const getBranchById = async (id) => {
  //console.log("read receipt by id " + id)
  return BranchModel.BranchModel.findByPk(id);
};



/**
 * Update Item by id
 * @param {ObjectId} ReceiptId
 * @param {Object} updateBody
 * @returns {Promise<ReceiptModel>}
 */
const updateBranchById = async (Id, updateBody, updatedBy) => {
  //console.log("item 12")

  const Item = await getBranchById(Id);
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
const deleteBranchById = async (Id) => {

  const Item = await getBranchById(Id);
  if (!Item) {
    throw new ApiError(httpStatus.NOT_FOUND, "Item not found");
  }
  await Item.destroy();
  return Item;
};



module.exports = {
  createBranch,
  queryBranch,
  getBranchById,
  updateBranchById,
  deleteBranchById
};
