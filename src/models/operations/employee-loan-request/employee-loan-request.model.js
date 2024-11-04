const Sequelize = require('sequelize');
const {FormModel,EmployeeProfileModel,Reimbursement_configurationModel,PayrollMonthModel}= require('../../index');
const sequelize = require('../../../config/db')
const { formatDates } = require('../../../utils/common');
const Employee_loan_request = sequelize.define('t_employee_loan_request', {
	Id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
    loan_typeId: { type: Sequelize.INTEGER, allowNull: false },
    monthly_installment: { type: Sequelize.FLOAT, allowNull: false },
	applied_date: {
		type: Sequelize.DATE,
		allowNull: false,
		get() {
			const rawValue = this.getDataValue('date');
			return rawValue ? formatDates(rawValue) : null;
		}
	},
    installment_start_date: {
		type: Sequelize.DATE,
		allowNull: false,
		get() {
			const rawValue = this.getDataValue('date');
			return rawValue ? formatDates(rawValue) : null;
		}
	},
    total_installment: { type: Sequelize.INTEGER,allowNull: false },
    reason: { type: Sequelize.STRING, },
    approval_statusId: { type: Sequelize.INTEGER,allowNull: false,defaultValue: 1 },
    statusId: { type: Sequelize.INTEGER,allowNull: false,defaultValue: 1 },
	companyId: { type: Sequelize.INTEGER,allowNull: false ,defaultValue: 1},
    subsidiaryId: { type: Sequelize.INTEGER,allowNull: false,defaultValue: 1 },
	companyId: { type: Sequelize.INTEGER,allowNull: false ,defaultValue: 1},
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


  
//   Employee_loan_request.belongsTo(FormModel, {
// 	foreignKey: 'reimbursement_typeId',
// 	targetKey: 'Id',
// 	as:"ReimbursementType"
//   });
  

module.exports = Employee_loan_request;