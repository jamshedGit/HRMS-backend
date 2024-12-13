const Sequelize = require('sequelize');
const { ResourceModel, SubsidiaryModel } = require('../..');

//import Database connection configurations.
const sequelize = require('../../../config/db');
const { formatDates } = require('../../../utils/common');

const TaxSetupModel = sequelize.define('t_tax_setup', {
	Id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	startDate: {
		type: Sequelize.DATE,
		allowNull: false,
		get() {
			const rawValue = this.getDataValue('startDate');
			return rawValue ? formatDates(rawValue) : null;
		}
	},
	// startDate : { type: Sequelize.DATE, allowNull: true },
	endDate: {
		type: Sequelize.DATE,
		allowNull: false,
		get() {
			const rawValue = this.getDataValue('endDate');
			return rawValue ? formatDates(rawValue) : null;
		}
	},
    // endDate : { type: Sequelize.DATE, allowNull: true },
	subsidiaryId : { type: Sequelize.INTEGER, allowNull: true },

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


TaxSetupModel.belongsTo(SubsidiaryModel, {
	foreignKey: 'subsidiaryId',
	as: "subs",
	targetKey: 'Id',  // Assuming 'Id' is the primary key in FormModel table
	onDelete: 'RESTRICT',
	onUpdate: 'CASCADE',
});



module.exports = TaxSetupModel;