const httpStatus = require("http-status");
const axios = require("axios")
const EmpPolicyModel = require("../../../models/index");
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
 * @param {Object} EmpPolicyBody
 * @returns {Promise<Bank>}
 */
const createEmpPolicy = async (req, EmpPolicyBody) => {
  console.log("EmpPolicy Body", EmpPolicyBody)
  // EmpPolicyBody.slug = EmpPolicyBody.name.replace(/ /g, "-").toLowerCase();
  console.log(req.user.id);
  EmpPolicyBody.createdBy = req.user.id;
  console.log(EmpPolicyBody, "body");
  const addedEmpPolicyObj = await EmpPolicyModel.EmployeePolicyModel.create(EmpPolicyBody);
  //authSMSSend(addedBankObj.dataValues);  // Quick send message at the time of donation
  return addedEmpPolicyObj;
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
const queryEmpPolicy = async (filter, options, searchQuery) => {
  console.log("get search query", searchQuery);

  console.log("options EmpPolicy", options);
  let limit = options.pageSize;
  let offset = 0 + (options.pageNumber - 1) * limit;
  console.log("EmpPolicyCode offset ", offset)
  searchQuery = searchQuery.toLowerCase();
  const queryFilters = [
    // { isActive: sequelize.where }
    // { Id: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('Id')), 'LIKE', '%' + searchQuery + '%') },
    { policyName: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('policyName')), 'LIKE', '%' + searchQuery + '%') },
    { code: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('code')), 'LIKE', '%' + searchQuery + '%') },

  ]


  const { count, rows } = await EmpPolicyModel.EmployeePolicyModel.findAndCountAll({
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
const getEmpPolicyById = async (id) => {
  console.log("read policy by id " + id);
  return EmpPolicyModel.EmployeePolicyModel.findByPk(id);
};

/**
 * Update Item by id
 * @param {ObjectId} ReceiptId
 * @param {Object} updateBody
 * @returns {Promise<ReceiptModel>}
 */
const updateEmpPolicyById = async (Id, updateBody, updatedBy) => {
  //console.log("item 12")

  const Item = await getEmpPolicyById(Id);
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
const deleteEmpPolicyById = async (Id) => {

  const Item = await getEmpPolicyById(Id);
  if (!Item) {
    throw new ApiError(httpStatus.NOT_FOUND, "Item not found");
  }
  await Item.destroy();
  return Item;
};



module.exports = {
  createEmpPolicy,
  queryEmpPolicy,
  getEmpPolicyById,
  updateEmpPolicyById,
  deleteEmpPolicyById
};
