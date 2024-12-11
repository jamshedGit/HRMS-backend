const httpStatus = require("http-status");
const axios = require("axios")
const { PayrollPolicyModel, PayrollEmailRecipentModel, PayrollEOBIAllowancesModel, PayrollBankInfoPolicy, FormModel, PayrollSessiAllowanceModel, SubsidiaryModel, CompanyModel } = require("../../../models/index");
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
  payollBodyObj.createdBy = req.user.id;

  const subsidiaryData = await SubsidiaryModel.findByPk(payollBodyObj.body.subsidiaryId, { attributes: ['companyId'] })

  const addedPayrollPolicyObj = await PayrollPolicyModel.create({ ...payollBodyObj.body, companyId: subsidiaryData?.companyId });

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
      bankName: element.bankName,
      isDefault: element.isDefault
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
    { Name: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('t_subsidiary.name')), 'LIKE', '%' + searchQuery + '%') },
  ]


  const { count, rows } = await PayrollPolicyModel.findAndCountAll({
    order: [
      ['createdAt', 'DESC']
    ],
    where: {
      [Op.or]: queryFilters,
      // isActive: true
    },
    include: [{ model: SubsidiaryModel, attributes: ['name'] }],
    offset: offset,
    limit: limit,
    attributes: ['Id', 'isActive']
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
const updatePayrollPolicyById = async (Id, updateBody, updatedBy, payollBodyObj) => {
  const Item = await getPayrollPolicyById(Id);
  if (!Item) {
    throw new ApiError(httpStatus.NOT_FOUND, "record not found");
  }

  updateBody.updatedBy = updatedBy;
  delete updateBody.id;
  Object.assign(Item, updateBody);
  await Item.save();
  const emailRecipentObj = []
  const listEOBIAllowancesObj = []
  const listSESSIAllowancesObj = []
  const listBankInfoPayroll = []
  const res_email = await sequelize.query(' delete from tran_email_recipents_setup where payrollConfigurationId = ' + Id);
  const res_payroll = await sequelize.query(' delete from tran_payroll_policy_bank_info where payrollConfigurationId = ' + Id);
  const eobi_allowance = await sequelize.query(' delete from tran_payroll_policy_eobiallowances where payrollConfigurationId = ' + Id);
  const sessi_allowance = await sequelize.query(' delete from tran_payroll_policy_sessiallowance where payrollConfigurationId = ' + Id);

  /// For Insert Employee sending email ID's
  payollBodyObj.emailRecipentList.forEach(element => {

    emailRecipentObj.push({
      subsidiaryId: payollBodyObj.body.subsidiaryId,
      companyId: payollBodyObj.body.companyId || 1,
      payrollConfigurationId: updateBody.Id,
      employeeId: element,
      email_sender_Id: updateBody.sender_emailId
    })

  });

  const emailRecipentResponse = await PayrollEmailRecipentModel.bulkCreate(emailRecipentObj);
  // --- END

  // this method used for bulk inserting employee EOBI Allowances
  payollBodyObj.eobiAllowancesList.forEach(element => {
    listEOBIAllowancesObj.push({
      subsidiaryId: payollBodyObj.body.subsidiaryId,
      companyId: payollBodyObj.body.companyId || 1,
      payrollConfigurationId: updateBody.Id,
      earningId: element,
    })
  });

  const eobiAllowanceResp = await PayrollEOBIAllowancesModel.bulkCreate(listEOBIAllowancesObj);

  // SESSI Allowance

  payollBodyObj.sessiAllowanceList.forEach(element => {
    listSESSIAllowancesObj.push({
      subsidiaryId: payollBodyObj.body.subsidiaryId,
      companyId: payollBodyObj.body.companyId || 1,
      payrollConfigurationId: updateBody.Id,
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
      payrollConfigurationId: updateBody.Id,
      journalBankAccountId: element.journalBankAccountId,
      bankCode: element.bankCode,
      bankAccountNo: element.bankAccountNo,
      bankName: element.bankName,
      isDefault: element.isDefault
    })
  });
  const payroll_bankInfoPolicy = await PayrollBankInfoPolicy.bulkCreate(listBankInfoPayroll);


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
