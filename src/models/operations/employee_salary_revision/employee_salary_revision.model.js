const Sequelize = require('sequelize');
const { ResourceModel } = require('../../..');

//import Database connection configurations.
const sequelize = require('../../../config/db')

const EmpSalaryRevisionModel = sequelize.define('t_employee_salary_revision', {
	Id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
		
    employeeId : { type: Sequelize.NUMBER, allowNull: true, defaultValue: true },
    reviewDate : { type: Sequelize.DATE, allowNull: true, defaultValue: true },
    old_grossSalary : { type: Sequelize.DOUBLE, allowNull: true, defaultValue: true },
    new_grossSalary : { type: Sequelize.DOUBLE, allowNull: true, defaultValue: true },
    old_basicSalary : { type: Sequelize.DOUBLE, allowNull: true, defaultValue: true },
    new_basicSalary : { type: Sequelize.DOUBLE, allowNull: true, defaultValue: true },
    old_payrollGroupId : { type: Sequelize.NUMBER, allowNull: true, defaultValue: true },
    new_payrollGroupId : { type: Sequelize.NUMBER, allowNull: true, defaultValue: true },
    old_designationId : { type: Sequelize.NUMBER, allowNull: true, defaultValue: true },
    new_designationId : { type: Sequelize.NUMBER, allowNull: true, defaultValue: true },
    old_employeeTypeId : { type: Sequelize.NUMBER, allowNull: true, defaultValue: true },
    new_employeeTypeId : { type: Sequelize.NUMBER, allowNull: true, defaultValue: true },
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

module.exports = EmpSalaryRevisionModel;