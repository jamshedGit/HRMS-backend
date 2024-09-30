const httpStatus = require("http-status");
const axios = require("axios")
const Emp_profileModel = require("../../../models/index");
const ApiError = require("../../../utils/ApiError");
const sequelize = require("../../../config/db");
const Sequelize = require('sequelize');
const { paginationFacts } = require("../../../utils/common");
const https = require('https');
const { XMLParser, XMLBuilder, XMLValidator } = require("fast-xml-parser");
const fns = require('date-fns');
const { getContactById } = require("../contact/contact.service");

const Op = Sequelize.Op;
/**
 * Create a Item
 * @param {Object} Emp_profileBody
 * @returns {Promise<Bank>}
 */
const createEmp_profile = async (req, Emp_profileBody) => {
  console.log("Emp_profile Body", Emp_profileBody)
  // Emp_profileBody.slug = Emp_profileBody.name.replace(/ /g, "-").toLowerCase();
  console.log(req.user.id);
  Emp_profileBody.createdBy = req.user.id;
  Emp_profileBody.subsidiaryId = 1; // 
  // Emp_profileBody.bankName = Emp_profileBody.Name;
  console.log(Emp_profileBody, "body");
  const addedEmp_profileObj = await Emp_profileModel.EmployeeProfileModel.create(Emp_profileBody);
  //authSMSSend(addedBankObj.dataValues);  // Quick send message at the time of donation
  return addedEmp_profileObj;
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
const queryEmp_profile = async (filter, options, searchQuery) => {
  console.log("get search query", searchQuery);

  console.log("options Emp_profile", options);
  let limit = options.pageSize;
  let offset = 0 + (options.pageNumber - 1) * limit;
  console.log("Emp_profileCode offset ", offset)
  searchQuery = searchQuery.toLowerCase();
  const queryFilters = [
    // { isActive: sequelize.where }
    // { Id: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('Id')), 'LIKE', '%' + searchQuery + '%') },
    { firstName: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('firstName')), 'LIKE', '%' + searchQuery + '%') },
    { lastName: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('lastName')), 'LIKE', '%' + searchQuery + '%') },

  ]

  const { count, rows } = await Emp_profileModel.EmployeeProfileModel.findAndCountAll({
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

const queryContactInfo = async () => {

  const queryFilters = [
    // { isActive: sequelize.where }
    // { Id: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('Id')), 'LIKE', '%' + searchQuery + '%') },
    { relation: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('relation')), 'LIKE', '%' + 'j' + '%') },
    { relation_name: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('relation_name')), 'LIKE', '%' + 'j' + '%') },

  ]


  const { count, rows } = await Emp_profileModel.ContactInformationModel.findAndCountAll({
    order: [
      ['createdAt', 'DESC']
    ],
    // where: {
    //   [Op.or]: queryFilters,
    //   // isActive: true
    // },
    offset: 0,
    limit: 10,
  });


  return paginationFacts(count, 10, 1, rows);
  // return Items;
};


/**
 * Get Item by id
 * @param {ObjectId} id
 * @returns {Promise<ReceiptModel>}
 */
const getEmp_profileById = async (id) => {
  //console.log("read receipt by id " + id)
  return Emp_profileModel.EmployeeProfileModel.findByPk(id);
};

const getContactInfoByEmployeeId = async (id) => {
  console.log("employee id " + id)

  const queryFilters = [
    // { isActive: sequelize.where }
    // { Id: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('Id')), 'LIKE', '%' + searchQuery + '%') },
    { employeeId: id},
    

  ]


  return Emp_profileModel.ContactInformationModel.findAndCountAll({
    order: [
      ['createdAt', 'DESC']
    ],
    where: {
      [Op.or]: queryFilters,
       isActive: true
    },
    offset: 0,
    limit: 10,
  });
};




/**
 * Update Item by id
 * @param {ObjectId} ReceiptId
 * @param {Object} updateBody
 * @returns {Promise<ReceiptModel>}
 */
const updateEmp_profileById = async (Id, updateBody, updatedBy) => {
  console.log("item 12",updateBody)

  const Item = await getEmp_profileById(Id);
  console.log("item", Item)
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

const usp_GetAllEmployeeProfileDetails = async (employeeCode) => {
  try {
    const results = await sequelize.query('CALL usp_GetAllEmployeeProfileDetails(:employeeId)', {
      replacements: { employeeId: employeeCode || 'null' },
      type: Sequelize.QueryTypes.RAW // Use RAW type for executing stored procedures
    });

    return results
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
  }
};




const updateContactById = async (Id, updateBody, updatedBy) => {
  //console.log("item 12")

  const Item = await getContactById(Id);
  console.log("item", Item)
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
const deleteEmp_profileById = async (Id) => {

  const Item = await getEmp_profileById(Id);
  if (!Item) {
    throw new ApiError(httpStatus.NOT_FOUND, "Item not found");
  }
  await Item.destroy();
  return Item;
};

module.exports = {
  createEmp_profile,
  queryEmp_profile,
  getEmp_profileById,
  updateEmp_profileById,
  deleteEmp_profileById,
  queryContactInfo,
  getContactInfoByEmployeeId,
  updateContactById,
  usp_GetAllEmployeeProfileDetails
};
