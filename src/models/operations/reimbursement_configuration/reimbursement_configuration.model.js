const Sequelize = require('sequelize');
const FormModel= require('../../index');
const sequelize = require('../../../config/db')

const Reimbursement_configuration = sequelize.define('t_reimbursement_configuration', {
	Id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},

    subsidiaryId: { type: Sequelize.INTEGER,allowNull: false },
	payroll_groupId: { type: Sequelize.INTEGER,allowNull: false },
	cycle_typeId: { type: Sequelize.INTEGER,allowNull: false },

    
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


Reimbursement_configuration.belongsTo(FormModel.FormModel, {
	foreignKey: 'subsidiaryId',
	targetKey: 'Id',
		as:"Subsidiary"
  });

  
  Reimbursement_configuration.belongsTo(FormModel.FormModel, {
	foreignKey: 'payroll_groupId',
	targetKey: 'Id',
	as:"PayrollGroup"
  });



module.exports = Reimbursement_configuration;