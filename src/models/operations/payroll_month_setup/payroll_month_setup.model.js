const Sequelize = require('sequelize');
const { ResourceModel, SubsidiaryModel } = require('../..');

//import Database connection configurations.
const sequelize = require('../../../config/db')

const PayrollMonthModel = sequelize.define('t_payroll_month_Setup', {
	Id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	month : { type: Sequelize.INTEGER, allowNull: true },
    year : { type: Sequelize.INTEGER, allowNull: true },
    month_days : { type: Sequelize.INTEGER, allowNull: true },
    shortFormat : { type: Sequelize.STRING(4), allowNull: true },
	startDate : { type: Sequelize.DATE, allowNull: true },
    endDate : { type: Sequelize.DATE, allowNull: true },
	subsidiaryId : { type: Sequelize.INTEGER, allowNull: true },
	companyId : { type: Sequelize.INTEGER, allowNull: true,defaultValue: 1 },
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

PayrollMonthModel.belongsTo(SubsidiaryModel, {
	foreignKey: 'subsidiaryId',
	as: "subs",
	targetKey: 'Id',  // Assuming 'Id' is the primary key in FormModel table
	
});


module.exports = PayrollMonthModel;