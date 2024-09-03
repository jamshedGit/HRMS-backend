const httpStatus = require("http-status");
const axios = require("axios")
const EmployeeTypeModel = require("../../../models/index");
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
 * @param {Object} EmployeeTypeBody
 * @returns {Promise<Bank>}
 */
const createEmployeeType = async (req, EmployeeTypeBody) => {
  console.log("EmployeeType Body", EmployeeTypeBody)
  // EmployeeTypeBody.slug = EmployeeTypeBody.name.replace(/ /g, "-").toLowerCase();
  console.log("employee Type userId",req.user.id);
  EmployeeTypeBody.createdBy = req.user.id;
  //EmployeeTypeBody.parentEmployeeType = 1;
   
  console.log(EmployeeTypeBody, "body");
  const addedEmployeeTypeObj = await EmployeeTypeModel.EmployeeTypeModel.create(EmployeeTypeBody);
  //authSMSSend(addedEmployeeTypeObj.dataValues);  // Quick send message at the time of donation
  return addedEmployeeTypeObj;
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
const queryEmployeeType = async (filter, options, searchQuery) => {
  console.log("get search query", searchQuery);

  console.log("options query EmployeeType", options);
  let limit = options.pageSize;
  let offset = 0 + (options.pageNumber - 1) * limit;
  console.log("EmployeeType offset ", offset)
  searchQuery = searchQuery.toLowerCase();
  const queryFilters = [

    { employeeType: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('employeeType')), 'LIKE', '%' + searchQuery + '%') },
    { employeeTypeCode: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('employeeTypeCode')), 'LIKE', '%' + searchQuery + '%') },

  ]


  const { count, rows } = await employeeTypeModel.employeeTypeModel.findAndCountAll({
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
const getEmployeeTypeById = async (id) => {
  console.log("read EmployeeType by id " + id)
  return EmployeeTypeModel.EmployeeTypeModel.findByPk(id);
};



/**
 * Update Item by id
 * @param {ObjectId} EmployeeTypeId
 * @param {Object} updateBody
 * @returns {Promise<ReceiptModel>}
 */
const updateEmployeeTypeById = async (EmployeeTypeId, updateBody, updatedBy) => {
  //console.log("item 12")

  const Item = await getEmployeeTypeById(EmployeeTypeId);
  console.log("EmployeeType item", Item)
  if (!Item) {
    throw new ApiError(httpStatus.NOT_FOUND, "record not found");
  }

  updateBody.updatedBy = updatedBy;
  delete updateBody.EmployeeTypeId;
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
const deleteEmployeeTypeById = async (Id) => {
  console.log("delete step 1", Id)
  const Item = await getEmployeeTypeById(Id);
  if (!Item) {
    throw new ApiError(httpStatus.NOT_FOUND, "Item not found");
  }
  await Item.destroy();
  return Item;
};



module.exports = {
  createEmployeeType,
  queryEmployeeType,
  getEmployeeTypeById,
  updateEmployeeTypeById,
  deleteEmployeeTypeById
};
