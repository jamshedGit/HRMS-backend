const Sequelize = require('sequelize');
const {FormModel,EmployeeProfileModel,Reimbursement_configurationModel}= require('../../index');
const sequelize = require('../../../config/db')

const Reimbursement_claim = sequelize.define('t_reimbursement_claim', {
	Id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
    reimbursement_typeId: { type: Sequelize.INTEGER, allowNull: false },
    employeeId: { type: Sequelize.INTEGER, allowNull: false },
	details: { type: Sequelize.STRING, },
	attachment: { type: Sequelize.STRING },
	date: { type: Sequelize.DATE },
    amount: { type: Sequelize.INTEGER,allowNull: false },
    pay_in_payroll_forId: { type: Sequelize.INTEGER, allowNull: false ,defaultValue:1},
    pay_slip_refId: { type: Sequelize.INTEGER, allowNull: false,defaultValue:1 },
    reimbursement_configurationId: { type: Sequelize.INTEGER, allowNull: false },
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



module.exports = Reimbursement_claim;