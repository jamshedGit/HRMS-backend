const httpStatus = require("http-status");
const axios = require("axios")
const { PayrollPolicyModel, PayrollEmailRecipentModel, PayrollEOBIAllowancesModel, PayrollBankInfoPolicy, FormModel, PayrollSessiAllowanceModel } = require("../../../models/index");
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
 * @param {Object} payollBodyObj
 * @returns {Promise<PayrollPolicy>}
 */
const createPayrollPolicy = async (req, payollBodyObj) => {
  console.log("::gg::", payollBodyObj)
  payollBodyObj.createdBy = req.user.id;

  const addedPayrollPolicyObj = await PayrollPolicyModel.create(payollBodyObj.body);

  const emailRecipentObj = []
  const listEOBIAllowancesObj = []
  const listSESSIAllowancesObj = []
  const listBankInfoPayroll = []
  /// For Insert Employee sending email ID's
  payollBodyObj.emailRecipentList.forEach(element => {

    emailRecipentObj.push({
      subsidiaryId: payollBodyObj.body.subsidiaryId,
      companyId: payollBodyObj.body.companyId || 1,
      payrollConfigurationId: addedPayrollPolicyObj.Id,
      employeeId: element,
      email_sender_Id: addedPayrollPolicyObj.sender_emailId
    })

  });

  const emailRecipentResponse = await PayrollEmailRecipentModel.bulkCreate(emailRecipentObj);
  // --- END

  // this method used for bulk inserting employee EOBI Allowances
  payollBodyObj.eobiAllowancesList.forEach(element => {
    listEOBIAllowancesObj.push({
      subsidiaryId: payollBodyObj.body.subsidiaryId,
      companyId: payollBodyObj.body.companyId || 1,
      payrollConfigurationId: addedPayrollPolicyObj.Id,
      earningId: element,
    })
  });

  const eobiAllowanceResp = await PayrollEOBIAllowancesModel.bulkCreate(listEOBIAllowancesObj);

  // SESSI Allowance

  payollBodyObj.sessiAllowanceList.forEach(element => {
    listSESSIAllowancesObj.push({
      subsidiaryId: payollBodyObj.body.subsidiaryId,
      companyId: payollBodyObj.body.companyId || 1,
      payrollConfigurationId: addedPayrollPolicyObj.Id,
      earningId: element,
    })
  });

  const sessiAllowanceResp = await PayrollSessiAllowanceModel.bulkCreate(listSESSIAllowancesObj);
  //  END

  // Insert Into BankInfo 
  payollBodyObj.bankInfoList.forEach(element => {
    listBankInfoPayroll.push({
      subsidiaryId: payollBodyObj.body.subsidiaryId,
      companyId: payollBodyObj.body.companyId || 1,
      payrollConfigurationId: addedPayrollPolicyObj.Id,
      journalBankAccountId: element.journalBankAccountId,
      bankCode: element.bankCode,
      bankAccountNo: element.bankAccountNo,
      bankName: element.bankName
    })
  });
  const payroll_bankInfoPolicy = await PayrollBankInfoPolicy.bulkCreate(listBankInfoPayroll);

  return addedPayrollPolicyObj;
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
const queryPayrollPolicy = async (filter, options, searchQuery) => {

  let limit = options.pageSize;
  let offset = 0 + (options.pageNumber - 1) * limit;

  searchQuery = searchQuery.toLowerCase();
  const queryFilters = [
    { Name: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('subsidiaryId')), 'LIKE', '%' + searchQuery + '%') },
  ]


  const { count, rows } = await PayrollPolicyModel.findAndCountAll({
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

/**
 * Get Item by id
 * @param {ObjectId} id
 * @returns {Promise<ReceiptModel>}
 */
const getPayrollPolicyById = async (id) => {
  return PayrollPolicyModel.findByPk(id, {
    include: [
      {
        model: PayrollEmailRecipentModel,
        attributes: ["employeeId"],

      },
      {
        model: PayrollEOBIAllowancesModel,
        attributes: ["earningId"],

      },
      {
        model: PayrollBankInfoPolicy,
        attributes: ["payrollConfigurationId", "journalBankAccountId", "bankCode", "bankName", "bankAccountNo", "isDefault"],

      },
      {
        model: PayrollSessiAllowanceModel,
        attributes: ["earningId"]
      }
    ]
  });
};



/**
 * Update Item by id
 * @param {ObjectId} ReceiptId
 * @param {Object} updateBody
 * @returns {Promise<ReceiptModel>}
 */
const updatePayrollPolicyById = async (Id, updateBody, updatedBy) => {
  console.log("tool", Id, updateBody, updatedBy)
  const Item = await getPayrollPolicyById(Id);
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
const deletePayrollPolicyById = async (Id) => {

  const Item = await getPayrollPolicyById(Id);
  if (!Item) {
    throw new ApiError(httpStatus.NOT_FOUND, "Item not found");
  }
  await Item.destroy();
  return Item;
};



module.exports = {
  createPayrollPolicy,
  queryPayrollPolicy,
  getPayrollPolicyById,
  updatePayrollPolicyById,
  deletePayrollPolicyById
};
