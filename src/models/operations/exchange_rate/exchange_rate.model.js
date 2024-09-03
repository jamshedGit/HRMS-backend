const Sequelize = require('sequelize');
const { ResourceModel } = require('../../..');

//import Database connection configurations.
const sequelize = require('../../../config/db')

const ExchangeRateModel = sequelize.define('t_exchange_rate', {
	Id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	
	subsidiaryId: { type: Sequelize.STRING, allowNull: true, defaultValue: true },
    base_currency_id: { type: Sequelize.NUMBER, allowNull: true, defaultValue: true },
    currency_to_convert_id : { type: Sequelize.NUMBER, allowNull: true, defaultValue: true },
    exchange_rate : { type: Sequelize.DOUBLE, allowNull: true, defaultValue: true },
    effective_date : { type: Sequelize.DATE, allowNull: true, defaultValue: true },
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

module.exports = ExchangeRateModel;