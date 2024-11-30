const Sequelize = require('sequelize');
const {EmployeeProfileModel,Employee_loan_requestModel}= require('../../index');
const sequelize = require('../../../config/db')
const { formatDates } = require('../../../utils/common');
const Employee_loan_request_detail = sequelize.define('t_employee_loan_request_detail', {
	Id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
   emp_loan_reqId: { type: Sequelize.INTEGER, allowNull: false },
	employeeId: { type: Sequelize.INTEGER, allowNull: false },
	amount_received: { type: Sequelize.INTEGER,allowNull: false },
    running_balance: { type: Sequelize.INTEGER, allowNull: false },
    is_deducted: { type: Sequelize.BOOLEAN, defaultValue: 0 },
	payroll_month_date: {
		type: Sequelize.DATE,
		allowNull: false,
		get() {
			const rawValue = this.getDataValue('applied_date');
			return rawValue ? formatDates(rawValue) : null;
		}
	},

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


  
  Employee_loan_request_detail.belongsTo(EmployeeProfileModel, {
	foreignKey: 'employeeId',
	targetKey: 'Id',
	as:"Employee"
  });
    

  Employee_loan_request_detail.belongsTo(Employee_loan_requestModel, {
    foreignKey: 'emp_loan_reqId',
    targetKey: 'Id', // Optional alias
	onDelete: 'CASCADE'
  });
  
  
  
  Employee_loan_requestModel.hasMany(Employee_loan_request_detail, {
    as: 'details', foreignKey: 'emp_loan_reqId',
  
  });
  

  

module.exports = Employee_loan_request_detail;