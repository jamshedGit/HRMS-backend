const Sequelize = require('sequelize');
const { ResourceModel } = require('../..');
const FormModel= require('../../index');
const RoleModel=require('../../index');
//import Database connection configurations.
const sequelize = require('../../../config/db')

const Loan_management_configuration = sequelize.define('t_loan_management_configuration', {
	Id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},

    subsidiaryId: { type: Sequelize.INTEGER,allowNull: false },
	accountId: { type: Sequelize.INTEGER },
	human_resource_role: { type: Sequelize.INTEGER, allowNull: false },
    emp_loan_account: { type: Sequelize.INTEGER, allowNull: false },
    installment_deduction_percentage: { type: Sequelize.DECIMAL, allowNull: false },
    installment_deduction_basis_type: { type: Sequelize.INTEGER, allowNull: false },

    
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


Loan_management_configuration.belongsTo(FormModel.FormModel, {
	foreignKey: 'subsidiaryId',
	targetKey: 'Id',
		as:"Subsidiary"
  });

  
Loan_management_configuration.belongsTo(FormModel.FormModel, {
	foreignKey: 'accountId',
	targetKey: 'Id',
	as:"Account"
  });




  Loan_management_configuration.belongsTo(RoleModel.RoleModel, {
	foreignKey: 'human_resource_role',
	targetKey: 'id', // Optional alias
  });





module.exports = Loan_management_configuration;