const httpStatus = require("http-status");
const axios = require("axios")
const DeptModel = require("../../../models/index");
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
 * @param {Object} DeptBody
 * @returns {Promise<Bank>}
 */
const createDept = async (req, DeptBody) => {
  console.log("Dept Body", DeptBody)
  // DeptBody.slug = DeptBody.name.replace(/ /g, "-").toLowerCase();
  
  DeptBody.createdBy = req.user.deptId;
  //DeptBody.parentDept = 1;

   if(DeptBody.parentDept == '')
      {DeptBody.parentDept = null}
  console.log(DeptBody, "body");
  const addedDeptObj = await DeptModel.DeptModel.create(DeptBody);
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
const queryDept = async (filter, options, searchQuery) => {
  console.log("get search query", searchQuery);

  console.log("options query dept", options);
  let limit = options.pageSize;
  let offset = 0 + (options.pageNumber - 1) * limit;
  console.log("dept offset ", offset)
  searchQuery = searchQuery.toLowerCase();
  const queryFilters = [

    { deptName: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('deptName')), 'LIKE', '%' + searchQuery + '%') },
    { deptCode: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('deptCode')), 'LIKE', '%' + searchQuery + '%') },

  ]


  const { count, rows } = await DeptModel.DeptModel.findAndCountAll({
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

const queryParentDept = async (filter, options, searchQuery) => {
  console.log("get search query", searchQuery);

  console.log("options query dept", options);
  let limit = options.pageSize;
  let offset = 0 + (options.pageNumber - 1) * limit;
  console.log("dept offset ", offset)
  searchQuery = searchQuery.toLowerCase();
  const queryFilters = [

    { parentDept: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('parentDept')), '=', '%' + null + '%') },

  ]


  const { count, rows } = await DeptModel.DeptModel.findAndCountAll({
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
const getDeptById = async (id) => {
  console.log("read dept by id " + id)
  return DeptModel.DeptModel.findByPk(id);
};



/**
 * Update Item by id
 * @param {ObjectId} deptId
 * @param {Object} updateBody
 * @returns {Promise<ReceiptModel>}
 */
const updateDeptById = async (deptId, updateBody, updatedBy) => {
  //console.log("item 12")

  const Item = await getDeptById(deptId);
  console.log("dept item", Item)
  if (!Item) {
    throw new ApiError(httpStatus.NOT_FOUND, "record not found");
  }

  updateBody.updatedBy = updatedBy;
  delete updateBody.deptId;
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
const deleteDeptById = async (Id) => {
  console.log("delete step 1", Id)
  const Item = await getDeptById(Id);
  if (!Item) {
    throw new ApiError(httpStatus.NOT_FOUND, "Item not found");
  }
  await Item.destroy();
  return Item;
};



module.exports = {
  createDept,
  queryDept,
  getDeptById,
  updateDeptById,
  deleteDeptById,
  queryParentDept
};
