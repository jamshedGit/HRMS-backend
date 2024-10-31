const Sequelize = require('sequelize');
const {FormModel,EmployeeProfileModel,Reimbursement_configurationModel,PayrollMonthModel}= require('../../index');
const sequelize = require('../../../config/db')
const { formatDates } = require('../../../utils/common');
const Reimbursement_claim = sequelize.define('t_reimbursement_claim', {
	Id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
    reimbursement_typeId: { type: Sequelize.INTEGER, allowNull: false },
    employeeId: { type: Sequelize.INTEGER, allowNull: false },
	details: { type: Sequelize.STRING, },
	file: { type: Sequelize.STRING },
	date: {
		type: Sequelize.DATE,
		allowNull: false,
		get() {
			const rawValue = this.getDataValue('date');
			return rawValue ? formatDates(rawValue) : null;
		}
	},
    amount: { type: Sequelize.INTEGER,allowNull: false },
    pay_in_payroll_forId: { type: Sequelize.INTEGER, },
    pay_slip_refId: { type: Sequelize.INTEGER, },
   
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


  
  Reimbursement_claim.belongsTo(FormModel, {
	foreignKey: 'reimbursement_typeId',
	targetKey: 'Id',
	as:"ReimbursementType"
  });
  
  Reimbursement_claim.belongsTo(EmployeeProfileModel, {
	foreignKey: 'employeeId',
	targetKey: 'Id',
	as:"Employee"
  });
    
  Reimbursement_claim.belongsTo(Reimbursement_configurationModel, {
	foreignKey: 'reimbursement_configurationId',
	targetKey: 'Id',
	as:"ReimbursementConfiguration"
  });
  PayrollMonthModel

  Reimbursement_claim.belongsTo(PayrollMonthModel, {
	foreignKey: 'pay_in_payroll_forId',
	targetKey: 'Id',
	as:"PayInPayrollForId"
  });
module.exports = Reimbursement_claim;