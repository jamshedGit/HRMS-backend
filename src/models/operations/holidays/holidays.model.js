const Sequelize = require('sequelize');
const { SubsidiaryModel,ReligionModel,FormModel } = require('../..');

//import Database connection configurations.
const sequelize = require('../../../config/db');
const { formatDates } = require('../../../utils/common');

const HolidaysModel = sequelize.define('t_holidays', {
	Id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	name: { type: Sequelize.STRING,allowNull: false },
	religionId: { type: Sequelize.INTEGER, },
	from_date: {
		type: Sequelize.DATE,
		allowNull: false,
		get() {
			const rawValue = this.getDataValue('from_date');
			return rawValue ? formatDates(rawValue) : null;
		}
	},
	to_date: {
		type: Sequelize.DATE,
		allowNull: false,
		get() {
			const rawValue = this.getDataValue('to_date');
			return rawValue ? formatDates(rawValue) : null;
		}
	},
	number_of_days: { type: Sequelize.INTEGER, allowNull: false },
	holiday_typeId: { type: Sequelize.INTEGER,allowNull: false},
	subsidiaryId: { type: Sequelize.INTEGER,allowNull: false },
	companyId: { type: Sequelize.INTEGER,allowNull: false ,defaultValue: 1},
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


HolidaysModel.belongsTo(SubsidiaryModel, {
	foreignKey: 'subsidiaryId',
	targetKey: 'Id',
		as:"Subsidiary"
  });

  HolidaysModel.belongsTo(FormModel, {
	foreignKey: 'holiday_typeId',
	targetKey: 'Id',
		as:"Holiday_type"
  });

  HolidaysModel.belongsTo(FormModel, {
	foreignKey: 'religionId',
	targetKey: 'Id',
		as:"Religion"
  });
module.exports = HolidaysModel;