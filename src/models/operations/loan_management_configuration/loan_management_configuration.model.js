const Sequelize = require('sequelize');
const { ResourceModel } = require('../..');
const FormModel= require('../../index');
//import Database connection configurations.
const sequelize = require('../../../config/db')

const Loan_management_configuration = sequelize.define('t_loan_management_configuration', {
	Id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},

    subsidiaryId: { type: Sequelize.INTEGER,allowNull: false },
	accountId
: { type: Sequelize.INTEGER },
	human_resource_role: { type: Sequelize.INTEGER, allowNull: false },
    emp_loan_account: { type: Sequelize.INTEGER, allowNull: false },
    installment_deduction_percentage: { type: Sequelize.DECIMAL, allowNull: false },
    installment_deduction_bases_type: { type: Sequelize.STRING, allowNull: false },

    
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


// Loan_management_configuration.belongsTo(FormModel.FormModel, {
// 	foreignKey: 'subsidiaryId',
// 	targetKey: 'Id', // Optional alias
//   });
  






module.exports = Loan_management_configuration;