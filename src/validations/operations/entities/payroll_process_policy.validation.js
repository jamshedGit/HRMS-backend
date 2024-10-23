const Joi = require("joi");

const createItem = {
  query: Joi.disallow(),
  params: Joi.disallow(),
  body: Joi.object().keys({
    
    subsidiaryId: Joi.disallow(),
    companyId  : Joi.disallow(),
    payroll_templateId : Joi.disallow(),
    employer_uniqueId : Joi.disallow(),
    payroll_approverId : Joi.disallow(),
    payroll_groupId : Joi.disallow(),

    //-- Email Sender ------------
    sender_emailId : Joi.disallow(),
    employee_email_recipentId : Joi.disallow(),

    //-- Accounting Impact ----
    basic_pay_accountId : Joi.disallow(),
    payroll_payable_accountId : Joi.disallow(),
    isGroupEarningOnAccount : Joi.disallow(),
    isGroupDeduductionOnAccount : Joi.disallow(),
    isAccrueGratuityOnPayroll : Joi.disallow(),

   // -- Tax Integration
    payrollTax_DeductionTypeId : Joi.disallow(),
    arrearTaxDeductionId : Joi.disallow(),
    isTrackDeductionHistory : Joi.disallow(),

    // Leave / AAtteandance Integraion
    isEnableAttandanceIntegration : Joi.disallow(),
    isEnableLeaveManagemenent : Joi.disallow(),
    isEnableOverTimeCalc : Joi.disallow(),
    leaveDeductionId : Joi.disallow(),
    lateCountPerDaySalaryDeduction: Joi.disallow(),
    leaveEnchashment_EarningId : Joi.disallow(),
    lateDeductionId : Joi.disallow(),
    overTimeEarningId : Joi.disallow(),
    isEnableSandwichLeavePolicy : Joi.disallow(),
    //-- Loan Integration	
    isEnableLoan : Joi.disallow(),
    loanDeductionId : Joi.disallow(),
    //--  EOBI Configuration
    isEnableEOBI : Joi.disallow(),
    eobi_deductionId : Joi.disallow(),
    eobi_earningId : Joi.disallow(),
    isIncludeBasic : Joi.disallow(),
    eobi_employeer_value_in_percent : Joi.disallow(),
    eobi_employee_value_in_percent : Joi.disallow(),

    // SESSI Configuration
    isEnableSESSI : Joi.disallow(),
    sessi_deductionId : Joi.disallow(),
    sessi_earningId : Joi.disallow(),
    isIncludeBasic : Joi.disallow(),
    sessi_employeer_value_in_percent : Joi.disallow(),
    sessi_employee_value_in_percent : Joi.disallow(),

    emailRecipentList : Joi.disallow(),
    eobiAllowancesList: Joi.disallow(),
    body: Joi.object().disallow(),
    bankInfoList: Joi.disallow(),
    sessiAllowanceList: Joi.disallow()
  }),
};

module.exports = {
  createItem
};
