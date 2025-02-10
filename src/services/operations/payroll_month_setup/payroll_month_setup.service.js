const httpStatus = require("http-status");
const axios = require("axios")
const PayrollMonthModel = require("../../../models/index");
const ApiError = require("../../../utils/ApiError");
const sequelize = require("../../../config/db");
const Sequelize = require('sequelize');
const { paginationFacts, formatDates, currentSubsidiaryPermission } = require("../../../utils/common");
const https = require('https');
const { XMLParser, XMLBuilder, XMLValidator } = require("fast-xml-parser");
const fns = require('date-fns');
const { checkMonthFinalizedStatus2 } = require("../../../utils/dbValidators");

const Op = Sequelize.Op;
/**
 * Create a Item
 * @param {Object} PayrollMonthBody
 * @returns {Promise<PayrollMonth>}
 */
const createPayrollMonth = async (req, PayrollMonthBody) => {
  PayrollMonthBody.startDate = formatDates(PayrollMonthBody.startDate, 'yyyy-MM-dd')
  PayrollMonthBody.endDate = formatDates(PayrollMonthBody.endDate, 'yyyy-MM-dd')

  PayrollMonthBody.createdBy = req.user.Id;
  let a=  await PayrollMonthModel.FiscalSetupModel.findOne({
    where: {
      subsidiaryId: PayrollMonthBody.subsidiaryId}
    });



  const fiscalYear = await PayrollMonthModel.FiscalSetupModel.findOne({
    where: {
      subsidiaryId: PayrollMonthBody.subsidiaryId,
      startDate: { [Op.lte]: sequelize.fn('DATE', PayrollMonthBody.startDate) }, // Ignore time part
      endDate: { [Op.gte]: sequelize.fn('DATE', PayrollMonthBody.endDate) }
    }
  });

  // Check if fiscal year found
  if (!fiscalYear) {
    throw new Error('Payroll month dates are out of the fiscal year range.');
  }
  //PayrollPolicyModel


  const toCheckTaxYear = await PayrollMonthModel.PayrollPolicyModel.findOne({
    where: {
      subsidiaryId: PayrollMonthBody.subsidiaryId,
      isEnableTax: true,
    }
  });

  // Check if fiscal year found
  if (toCheckTaxYear) {
    const taxYear = await PayrollMonthModel.TaxSetupModel.findOne({
      where: {
        subsidiaryId: PayrollMonthBody.subsidiaryId,
        startDate: { [Op.lte]: sequelize.fn('DATE', PayrollMonthBody.startDate) }, // Ignore time part
      endDate: { [Op.gte]: sequelize.fn('DATE', PayrollMonthBody.endDate) }
      }
    });

    // Check if fiscal year found
    if (!taxYear) {
      throw new Error('Payroll month dates are out of the tax year range.');
    }
  }
let body={
  companyId:req.user.companyId,
  subsidiaryId:PayrollMonthBody.subsidiaryId,
}
  await checkMonthFinalizedStatus2(body)

  const resp = await sequelize.query(' update t_payroll_month_Setup set isActive = 0 where subsidiaryId =  ' + PayrollMonthBody.subsidiaryId);
  PayrollMonthBody.companyId=req.user.companyId;
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
const queryPayrollMonths = async (req, filter, options, searchQuery) => {

  let limit = options.pageSize;
  let offset = 0 + (options.pageNumber - 1) * limit;

  searchQuery = searchQuery.toLowerCase();
  const queryFilters = [
    { startDate: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('startDate')), 'LIKE', '%' + searchQuery + '%') },
    { endDate: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('endDate')), 'LIKE', '%' + searchQuery + '%') },
    { month: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('month')), 'LIKE', '%' + searchQuery + '%') },
    { year: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('year')), 'LIKE', '%' + searchQuery + '%') },
    { name: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('subs.name')), 'LIKE', '%' + searchQuery + '%') },
  ]


  const { count, rows } = await PayrollMonthModel.PayrollMonthModel.findAndCountAll({
    order: [
      ['createdAt', 'DESC']
    ],
    where: {
      [Op.or]: queryFilters,
      subsidiaryId: {
        [Op.in]: await currentSubsidiaryPermission(req)  // Filter banks based on subsidiaryId
      }
      // isActive: true
    },
    offset: offset,
    limit: limit,
    include: [
      {
        model: PayrollMonthModel.SubsidiaryModel,
        attributes: ["Id", ["name", "subsName"]],
        as: "subs"
      }
    ],
  });


  return paginationFacts(count, limit, options.pageNumber, rows);

};


const SP_GetActivePreviousPayrollMonth = async (p_subsidiaryId, employeeId) => {
  try {
  
    let subsidiaryId = p_subsidiaryId;
    if (employeeId) {
      const data = await PayrollMonthModel.EmployeeProfileModel.findByPk(employeeId, {
        attributes: ['Id', 'subsidiaryId']
      })

      if (data.subsidiaryId) {
        subsidiaryId = data.subsidiaryId;
      }
    }


    // const results = await sequelize.query('CALL usp_GetActivePreviousPayrollMonth(:p_subsidiaryId)', {
    //   replacements: { p_subsidiaryId: p_subsidiaryId || 'null' },
    //   type: Sequelize.QueryTypes.RAW // Use RAW type for executing stored procedures
    // });
    // select * from t_payroll_month_setup where isActive = 1 AND subsidiaryId=p_subsidiaryId

    const results = await PayrollMonthModel.PayrollMonthModel.findOne({
      where: {
        subsidiaryId: subsidiaryId,
        isActive: true

      },
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

  const Item = await getPayrollMonthById(Id);
  if (!Item) {
    throw new ApiError(httpStatus.NOT_FOUND, "record not found");
  }

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
