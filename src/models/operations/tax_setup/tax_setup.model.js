const Sequelize = require('sequelize');
const { ResourceModel } = require('../..');

//import Database connection configurations.
const sequelize = require('../../../config/db')

const TaxSetupModel = sequelize.define('t_tax_setup', {
	Id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	
	startDate : { type: Sequelize.DATE, allowNull: true },
    endDate : { type: Sequelize.DATE, allowNull: true },
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

module.exports = TaxSetupModel;