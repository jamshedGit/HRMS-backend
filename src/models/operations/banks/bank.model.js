const Sequelize = require('sequelize');
const { ResourceModel, SubsidiaryModel } = require('../..');

//import Database connection configurations.
const sequelize = require('../../../config/db')

const BankModel = sequelize.define('t_bank', {
	Id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	Name: { type: Sequelize.STRING(50), allowNull: true },
	isActive: { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: true },
	subsidiaryId: { type: Sequelize.INTEGER, allowNull: true },
	companyId: { type: Sequelize.INTEGER, allowNull: true },
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

BankModel.belongsTo(SubsidiaryModel, {
	foreignKey: 'subsidiaryId',
	as: "subs",
	targetKey: 'Id',  // Assuming 'Id' is the primary key in FormModel table
	onDelete: 'RESTRICT',
	onUpdate: 'CASCADE',
});


module.exports = BankModel;