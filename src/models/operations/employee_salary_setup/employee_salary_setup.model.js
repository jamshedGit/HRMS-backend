const Sequelize = require('sequelize');
const { ResourceModel } = require('../../..');

//import Database connection configurations.
const sequelize = require('../../../config/db')

const EmpSalaryModel = sequelize.define('t_employee_salary_benefits', {
	Id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
		
	employeeId : { type: Sequelize.NUMBER, allowNull: true, defaultValue: true },
	
    currencyId : { type: Sequelize.NUMBER, allowNull: true, defaultValue: true },
    grossSalary : { type: Sequelize.NUMBER, allowNull: true, defaultValue: true },
    basicSalary : { type: Sequelize.NUMBER, allowNull: true, defaultValue: true },
    gratuity_member : { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: true },
    gratuity_startDate : { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: true },
    overtime_allowance : { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: true },
    shift_allowance : { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: true },
    regularity_allowance : { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: true },
    punctuality_allowance : { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: true },
    pf_member : { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: true },
    pf_reg_date : { type: Sequelize.DATE, allowNull: true, defaultValue: true },
    pf_accNo : { type: Sequelize.STRING, allowNull: true, defaultValue: true },
    eobi_member : { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: true },
    eobi_reg_date : { type: Sequelize.DATE, allowNull: true, defaultValue: true },
    eobi_accNo :{ type: Sequelize.STRING, allowNull: true, defaultValue: true },
    social_security_member : { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: true },
    social_security_reg_date : { type: Sequelize.DATE, allowNull: true, defaultValue: true },
    social_security_accNo : { type: Sequelize.STRING, allowNull: true, defaultValue: true },
    pension_member : { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: true },
    pension_reg_date : { type: Sequelize.DATE, allowNull: true, defaultValue: true },
    pension_accNo: { type: Sequelize.STRING, allowNull: true, defaultValue: true },
    profit_member :{ type: Sequelize.BOOLEAN, allowNull: true, defaultValue: true },
    emp_bankId : { type: Sequelize.NUMBER, allowNull: true, defaultValue: true },
    emp_bank_branchId : { type: Sequelize.NUMBER, allowNull: true, defaultValue: true },
    emp_bank_accountTitle: { type: Sequelize.STRING, allowNull: true, defaultValue: true },
    emp_bank_accNo: { type: Sequelize.STRING, allowNull: true, defaultValue: true },
    payment_mode_Id : { type: Sequelize.NUMBER, allowNull: true, defaultValue: true },
    company_bankId : { type: Sequelize.NUMBER, allowNull: true, defaultValue: true },
    company_branchId : { type: Sequelize.NUMBER, allowNull: true, defaultValue: true },
    company_from_accNo :{ type: Sequelize.STRING, allowNull: true, defaultValue: true },
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

module.exports = EmpSalaryModel;