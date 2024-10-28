const Sequelize = require('sequelize');
const FormModel= require('../../index');
const sequelize = require('../../../config/db')

const Gratuity_configuration = sequelize.define('t_gratuity_configuration', {
	Id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},

    subsidiaryId: { type: Sequelize.INTEGER,allowNull: false },
	contract_typeId: { type: Sequelize.INTEGER,allowNull: false },
	basis_of_gratuityId: { type: Sequelize.INTEGER, allowNull: false },
   num_of_days: { type: Sequelize.INTEGER, allowNull: false },
   gratuity_fraction: { type: Sequelize.INTEGER, allowNull: false },
    min_year: { type: Sequelize.INTEGER, allowNull: false },
    max_year: { type: Sequelize.INTEGER, allowNull: false },

    
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


Gratuity_configuration.belongsTo(FormModel.FormModel, {
	foreignKey: 'subsidiaryId',
	targetKey: 'Id',
		as:"Subsidiary"
  });

  
  Gratuity_configuration.belongsTo(FormModel.FormModel, {
	foreignKey: 'contract_typeId',
	targetKey: 'Id',
	as:"Contract_Type"
  });





module.exports = Gratuity_configuration;