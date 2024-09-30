const httpStatus = require("http-status");
const axios = require("axios")
const  PayrollMonthModel  = require("../../../models/index");
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
 * @param {Object} PayrollMonthBody
 * @returns {Promise<PayrollMonth>}
 */
const createPayrollMonth = async (req, PayrollMonthBody) => {
   
  console.log(req.user.id);
  PayrollMonthBody.createdBy = req.user.id;
 
  const resp = await sequelize.query(' update t_payroll_month_Setup set isActive = 0');

  const addedPayrollMonthObj = await PayrollMonthModel.PayrollMonthModel.create(PayrollMonthBody);
  //authSMSSend(addedPayrollMonthObj.dataValues);  // Quick send message at the time of donation
  return addedPayrollMonthObj;
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
const queryPayrollMonths = async (filter, options, searchQuery) => {
  
  let limit = options.pageSize;
  let offset = 0 + (options.pageNumber - 1) * limit;
  
  searchQuery = searchQuery.toLowerCase();
  const queryFilters = [
    { Name: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('startDate')), 'LIKE', '%' + searchQuery + '%') },
  ]


  const { count, rows } = await PayrollMonthModel.PayrollMonthModel.findAndCountAll({
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


const SP_GetActivePreviousPayrollMonth = async (employeeId) => {
  try {
    console.log("EmployeeTransfer empID", employeeId);
    const results = await sequelize.query('CALL usp_GetActivePreviousPayrollMonth()', {
      type: Sequelize.QueryTypes.RAW // Use RAW type for executing stored procedures
    });

    return results;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
  }
};

/**
 * Get Item by id
 * @param {ObjectId} id
 * @returns {Promise<ReceiptModel>}
 */
const getPayrollMonthById = async (id) => {
  return PayrollMonthModel.PayrollMonthModel.findByPk(id);
};

/**
 * Update Item by id
 * @param {ObjectId} ReceiptId
 * @param {Object} updateBody
 * @returns {Promise<ReceiptModel>}
 */
const updatePayrollMonthById = async (Id, updateBody, updatedBy) => {
  console.log("tool",Id, updateBody, updatedBy)
  const Item = await getPayrollMonthById(Id);
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
  const deletePayrollMonthById = async (Id) => {

  const Item = await getPayrollMonthById(Id);
  if (!Item) {
    throw new ApiError(httpStatus.NOT_FOUND, "Item not found");
  }
  await Item.destroy();
  return Item;
};



module.exports = {
  createPayrollMonth,
  queryPayrollMonths,
  getPayrollMonthById,
  updatePayrollMonthById,
  deletePayrollMonthById,
  SP_GetActivePreviousPayrollMonth
};
