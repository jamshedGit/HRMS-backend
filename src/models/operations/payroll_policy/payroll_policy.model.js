const Sequelize = require('sequelize');

//import Database connection configurations.
const sequelize = require('../../../config/db');
const  formModel  = require('../../index');

const parent_PayrollConfig = sequelize.define('t_payroll_configuration', {
  Id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  subsidiaryId: { type: Sequelize.INTEGER, allowNull: true, defaultValue: true },
  companyId: { type: Sequelize.INTEGER, allowNull: true, defaultValue: true },
  payroll_templateId: { type: Sequelize.INTEGER, allowNull: true, defaultValue: true },
  employer_uniqueId: { type: Sequelize.INTEGER, allowNull: true, defaultValue: true },
  payroll_approverId: { type: Sequelize.INTEGER, allowNull: true, defaultValue: true },
  payroll_groupId: { type: Sequelize.INTEGER, allowNull: true, defaultValue: true },

  //  -- Email Sender ------------
  sender_emailId: { type: Sequelize.INTEGER, allowNull: true, defaultValue: true },
  employee_email_recipentId: { type: Sequelize.INTEGER, allowNull: true, defaultValue: true },

  // -- Accounting Impact ----
  basic_pay_accountId: { type: Sequelize.INTEGER, allowNull: true, defaultValue: true },
  payroll_payable_accountId: { type: Sequelize.INTEGER, allowNull: true, defaultValue: true },
  isGroupEarningOnAccount: { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: true },
  isGroupDeduductionOnAccount: { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: true },
  isAccrueGratuityOnPayroll: { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: true },

  // -- Tax Integration
  payrollTax_DeductionTypeId: { type: Sequelize.INTEGER, allowNull: true, defaultValue: true },
  arrearTaxDeductionId: { type: Sequelize.INTEGER, allowNull: true, defaultValue: true },
  isTrackDeductionHistory: { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: true },

  //  -- Leave / AAtteandance Integraion
  isEnableAttandanceIntegration: { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: true },
  isEnableLeaveManagemenent: { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: true },
  isEnableOverTimeCalc: { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: true },
  leaveDeductionId: { type: Sequelize.INTEGER, allowNull: true, defaultValue: true },
  lateCountPerDaySalaryDeduction: { type: Sequelize.INTEGER, allowNull: true, defaultValue: true },
  leaveEnchashment_EarningId: { type: Sequelize.INTEGER, allowNull: true, defaultValue: true },
  lateDeductionId: { type: Sequelize.INTEGER, allowNull: true, defaultValue: true },
  overTimeEarningId: { type: Sequelize.INTEGER, allowNull: true, defaultValue: true },
  isEnableSandwichLeavePolicy: { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: true },

  //   -- Loan Integration	
  isEnableLoan: { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: true },
  loanDeductionId: { type: Sequelize.INTEGER, allowNull: true, defaultValue: true },

  //   --  EOBI Configuration
  isEnableEOBI: { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: true },
  eobi_deductionId: { type: Sequelize.INTEGER, allowNull: true, defaultValue: true },
  eobi_earningId: { type: Sequelize.INTEGER, allowNull: true, defaultValue: true },
  isIncludeBasic: { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: true },
  eobi_employeer_value_in_percent: { type: Sequelize.DECIMAL, allowNull: true, defaultValue: true },
  eobi_employee_value_in_percent: { type: Sequelize.DECIMAL, allowNull: true, defaultValue: true },

  //  SESSI Configuration
  isEnableSESSI :{ type: Sequelize.BOOLEAN, allowNull: true, defaultValue: true },
  sessi_deductionId :{ type: Sequelize.INTEGER, allowNull: true, defaultValue: true },
  sessi_earningId : { type: Sequelize.INTEGER, allowNull: true, defaultValue: true },
  sessi_employeer_value_in_percent : { type: Sequelize.DECIMAL, allowNull: true, defaultValue: true },
  sessi_employee_value_in_percent : { type: Sequelize.DECIMAL, allowNull: true, defaultValue: true },

  isActive: { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: true },
  createdBy: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  updatedBy: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  createdAt: { type: Sequelize.DATE, allowNull: true },
  updatedAt: { type: Sequelize.DATE, allowNull: true },

});

module.exports = parent_PayrollConfig;