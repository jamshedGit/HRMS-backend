const Sequelize = require('sequelize');

//import Database connection configurations.
const sequelize = require('../../../config/db');
const { CompanyModel, SubsidiaryModel } = require('../..');

const parent_PayrollConfig = sequelize.define('t_payroll_configuration', {
  Id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  subsidiaryId: { type: Sequelize.INTEGER, allowNull: true },
  companyId: { type: Sequelize.INTEGER, allowNull: true },
  payroll_templateId: { type: Sequelize.INTEGER, allowNull: true },
  employer_uniqueId: { type: Sequelize.INTEGER, allowNull: true },
  payroll_approverId: { type: Sequelize.INTEGER, allowNull: true },
  payroll_groupId: { type: Sequelize.INTEGER, allowNull: true },
  basicSalaryId: { type: Sequelize.INTEGER, allowNull: true },

  //  -- Email Sender ------------
  sender_emailId: { type: Sequelize.INTEGER, allowNull: true },
  employee_email_recipentId: { type: Sequelize.INTEGER, allowNull: true },

  // -- Accounting Impact ----
  isEnableAccounting: { type: Sequelize.BOOLEAN, allowNull: true },
  basic_pay_accountId: { type: Sequelize.INTEGER, allowNull: true },
  payroll_payable_accountId: { type: Sequelize.INTEGER, allowNull: true },
  isGroupEarningOnAccount: { type: Sequelize.BOOLEAN, allowNull: true },
  isGroupDeduductionOnAccount: { type: Sequelize.BOOLEAN, allowNull: true },
  isAccrueGratuityOnPayroll: { type: Sequelize.BOOLEAN, allowNull: true },

  // -- Tax Integration
  isEnableTax: { type: Sequelize.BOOLEAN, allowNull: true },
  payrollTax_DeductionTypeId: { type: Sequelize.INTEGER, allowNull: true },
  arrearTaxDeductionId: { type: Sequelize.INTEGER, allowNull: true },
  isTrackDeductionHistory: { type: Sequelize.BOOLEAN, allowNull: true },

  //  -- Leave / AAtteandance Integraion
  isEnableAttandanceIntegration: { type: Sequelize.BOOLEAN, allowNull: true },
  isEnableLeaveManagemenent: { type: Sequelize.BOOLEAN, allowNull: true },
  isEnableOverTimeCalc: { type: Sequelize.BOOLEAN, allowNull: true },
  leaveDeductionId: { type: Sequelize.INTEGER, allowNull: true },
  lateCountPerDaySalaryDeduction: { type: Sequelize.INTEGER, allowNull: true },
  leaveEnchashment_EarningId: { type: Sequelize.INTEGER, allowNull: true },
  lateDeductionId: { type: Sequelize.INTEGER, allowNull: true },
  overTimeEarningId: { type: Sequelize.INTEGER, allowNull: true },
  isEnableSandwichLeavePolicy: { type: Sequelize.BOOLEAN, allowNull: true },

  //   -- Loan Integration	
  isEnableLoan: { type: Sequelize.BOOLEAN, allowNull: true },
  loanDeductionId: { type: Sequelize.INTEGER, allowNull: true },

  //   --  EOBI Configuration
  isEnableEOBI: { type: Sequelize.BOOLEAN, allowNull: true },
  eobi_basis: { type: Sequelize.FLOAT, allowNull: true },
  eobi_deductionId: { type: Sequelize.INTEGER, allowNull: true },
  eobi_earningId: { type: Sequelize.INTEGER, allowNull: true },
  isIncludeBasic: { type: Sequelize.BOOLEAN, allowNull: true },
  eobi_employeer_value_in_percent: { type: Sequelize.DECIMAL, allowNull: true },
  eobi_employee_value_in_percent: { type: Sequelize.DECIMAL, allowNull: true },

  //  SESSI Configuration
  isEnableSESSI: { type: Sequelize.BOOLEAN, allowNull: true },
  sessi_basis: { type: Sequelize.FLOAT, allowNull: true },
  sessi_deductionId: { type: Sequelize.INTEGER, allowNull: true },
  sessi_earningId: { type: Sequelize.INTEGER, allowNull: true },
  sessi_employeer_value_in_percent: { type: Sequelize.DECIMAL, allowNull: true },
  sessi_employee_value_in_percent: { type: Sequelize.DECIMAL, allowNull: true },

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

// Association with SubsidiaryModel model (subsidiaryId is a foreign key)
SubsidiaryModel.hasMany(parent_PayrollConfig, { foreignKey: 'subsidiaryId' });
parent_PayrollConfig.belongsTo(SubsidiaryModel, {
  foreignKey: 'subsidiaryId',
  targetKey: 'Id',  // Assuming 'Id' is the primary key in SubsidiaryModel table
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE',
});

// // Association with CompanyModel model (companyId is a foreign key)
CompanyModel.hasMany(parent_PayrollConfig, { foreignKey: 'companyId' });
parent_PayrollConfig.belongsTo(CompanyModel, {
  foreignKey: 'companyId',
  targetKey: 'Id',  // Assuming 'Id' is the primary key in CompanyModel table
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE',
});

module.exports = parent_PayrollConfig;