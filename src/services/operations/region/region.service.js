const httpStatus = require("http-status");
const axios = require("axios")

const ApiError = require("../../../utils/ApiError");
const sequelize = require("../../../config/db");
const Sequelize = require('sequelize');
const { paginationFacts } = require("../../../utils/common");
const https = require('https');
const { XMLParser, XMLBuilder, XMLValidator } = require("fast-xml-parser");
const fns = require('date-fns');

const RegionModel = require("../../../models/operations/region/region.model");

const Op = Sequelize.Op;
/**
 * Create a Item
 * @param {Object} RegionBody
 * @returns {Promise<Bank>}
 */
const createRegion = async (req, RegionBody) => {
  console.log("region Body", RegionBody)
  // RegionBody.slug = RegionBody.name.replace(/ /g, "-").toLowerCase();
  console.log("userid",req.user.Id);
  RegionBody.createdBy = req.user.Id;
  //RegionBody.parentDept = 1;
   
  console.log(RegionBody, "body");
  const addedDeptObj = await RegionModel.create(RegionBody);
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
const queryRegion = async (filter, options, searchQuery) => {
  console.log("get search query", searchQuery);

  console.log("options query religion", options);
  let limit = options.pageSize;
  let offset = 0 + (options.pageNumber - 1) * limit;
  console.log("dept offset ", offset)
  searchQuery = searchQuery.toLowerCase();
  const queryFilters = [

    { regionName: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('regionName')), 'LIKE', '%' + searchQuery + '%') },
    { regionCode: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('regionCode')), 'LIKE', '%' + searchQuery + '%') },

  ]


  const { count, rows } = await RegionModel.findAndCountAll({
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
const getRegionById = async (id) => {
  console.log("read Religion by id " + id)
  return RegionModel.findByPk(id);
};



/**
 * Update Item by id
 * @param {ObjectId} Id
 * @param {Object} updateBody
 * @returns {Promise<ReceiptModel>}
 */
const updateRegionById = async (Id, updateBody, updatedBy) => {
  //console.log("item 12")

  const Item = await getRegionById(Id);
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
const deleteRegionById = async (Id) => {
  console.log("delete step 1", Id)
  const Item = await getRegionById(Id);
  if (!Item) {
    throw new ApiError(httpStatus.NOT_FOUND, "Item not found");
  }
  await Item.destroy();
  return Item;
};

module.exports = {
  createRegion,
  queryRegion,
  getRegionById,
  updateRegionById,
  deleteRegionById
};
