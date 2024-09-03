const httpStatus = require("http-status");
const axios = require("axios")

const ApiError = require("../../../utils/ApiError");
const sequelize = require("../../../config/db");
const Sequelize = require('sequelize');
const { paginationFacts } = require("../../../utils/common");
const https = require('https');
const { XMLParser, XMLBuilder, XMLValidator } = require("fast-xml-parser");
const fns = require('date-fns');
const ReligionModel = require("../../../models/operations/religion/religion.model");

const Op = Sequelize.Op;
/**
 * Create a Item
 * @param {Object} ReligionBody
 * @returns {Promise<Bank>}
 */
const createReligion = async (req, ReligionBody) => {
  console.log("Dept Body", ReligionBody)
  // ReligionBody.slug = ReligionBody.name.replace(/ /g, "-").toLowerCase();
  console.log("userid",req.user.Id);
  ReligionBody.createdBy = req.user.Id;
  //ReligionBody.parentDept = 1;

 
   
  console.log(ReligionBody, "body");
  const addedDeptObj = await ReligionModel.create(ReligionBody);
  //authSMSSend(addedDeptObj.dataValues);  // Quick send message at the time of donation
  return addedDeptObj;
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
const queryReligion = async (filter, options, searchQuery) => {
  console.log("get search query", searchQuery);

  console.log("options query religion", options);
  let limit = options.pageSize;
  let offset = 0 + (options.pageNumber - 1) * limit;
  console.log("dept offset ", offset)
  searchQuery = searchQuery.toLowerCase();
  const queryFilters = [

    { religionName: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('religionName')), 'LIKE', '%' + searchQuery + '%') },
    { religionCode: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('religionCode')), 'LIKE', '%' + searchQuery + '%') },

  ]


  const { count, rows } = await ReligionModel.findAndCountAll({
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
const getReligionById = async (id) => {
  console.log("read Religion by id " + id)
  return ReligionModel.findByPk(id);
};



/**
 * Update Item by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<ReceiptModel>}
 */
const updateReligionById = async (Id, updateBody, updatedBy) => {
  //console.log("item 12")

  const Item = await getReligionById(Id);
  console.log("Religion item", Item)
  console.log("updateBody 2",updateBody,updatedBy);
  if (!Item) {
    throw new ApiError(httpStatus.NOT_FOUND, "record not found");
  }

  updateBody.updatedBy = updatedBy;
  delete updateBody.Id;
  Object.assign(Item, updateBody);
  console.log("updateBody", updateBody)
  await Item.save();
  return;
};

/**
 * Delete Item by id
 * @param {ObjectId} Id
 * @returns {Promise<ReceiptModel>}
 */
const deleteReligionById = async (Id) => {
  console.log("delete step 1", Id)
  const Item = await getReligionById(Id);
  if (!Item) {
    throw new ApiError(httpStatus.NOT_FOUND, "Item not found");
  }
  await Item.destroy();
  return Item;
};



module.exports = {
  createReligion,
  queryReligion,
  getReligionById,
  updateReligionById,
  deleteReligionById
};
