const Sequelize = require('sequelize');
const { ResourceModel } = require('../../..');

//import Database connection configurations.
const sequelize = require('../../../config/db');
const { SubsidiaryModel, FormModel } = require('../..');
const { formatDates } = require('../../../utils/common');

const ExchangeRateModel = sequelize.define('t_exchange_rate', {
	Id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	
	subsidiaryId: { type: Sequelize.INTEGER, allowNull: true, defaultValue: true },
    base_currency_id: { type: Sequelize.INTEGER, allowNull: true, defaultValue: true },
    currency_to_convert_id : { type: Sequelize.INTEGER, allowNull: true, defaultValue: true },
    exchange_rate : { type: Sequelize.DOUBLE, allowNull: true, defaultValue: true },
    effective_date : { type: Sequelize.DATE, allowNull: true, defaultValue: true },
	// effective_date: {
	// 	type: Sequelize.DATE,
	// 	allowNull: false,
	// 	get() {
	// 		const rawValue = this.getDataValue('effective_date');
	// 		return rawValue ? formatDates(rawValue) : null;
	// 	}
	// },
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
	companyId: { type: Sequelize.INTEGER, allowNull: true}

});

ExchangeRateModel.belongsTo(SubsidiaryModel, {
	foreignKey: 'subsidiaryId',
	targetKey: 'Id',
		as:"Subsidiary"
  });

module.exports = ExchangeRateModel;