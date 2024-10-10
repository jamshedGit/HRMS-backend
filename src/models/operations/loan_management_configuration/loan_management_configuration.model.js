const Sequelize = require('sequelize');
const { ResourceModel } = require('../..');

//import Database connection configurations.
const sequelize = require('../../../config/db')

const Loan_management_configuration = sequelize.define('t_loan_management_configuration', {
	Id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},

    subsidiary: { type: Sequelize.INTEGER,allowNull: false },
	account: { type: Sequelize.INTEGER },
	human_resource_role: { type: Sequelize.INTEGER, allowNull: false },
    emp_loan_account: { type: Sequelize.INTEGER, allowNull: false },
    installment_deduction_percentage: { type: Sequelize.DECIMAL, allowNull: false },
    installment_deduction_bases: { type: Sequelize.INTEGER, allowNull: false },
	loan_type: { type: Sequelize.INTEGER, allowNull: false },
    max_loan_amount: { type: Sequelize.INTEGER, allowNull: false },
    salary_count: { type: Sequelize.INTEGER, allowNull: false },
    
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

module.exports = Loan_management_configuration