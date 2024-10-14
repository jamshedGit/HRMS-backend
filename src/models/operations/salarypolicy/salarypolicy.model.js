const Sequelize = require('sequelize');
const { ResourceModel } = require('../..');

//import Database connection configurations.
const sequelize = require('../../../config/db')

const salarypolicyModel = sequelize.define('t_salarypolicy', {
	Id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
    companyId: { type: Sequelize.INTEGER, allowNull: true},
    subsidiaryId: { type: Sequelize.INTEGER, allowNull: true },
    type: { type: Sequelize.STRING,allowNull: false },
	value: { type: Sequelize.INTEGER },
	divisor: { type: Sequelize.INTEGER, allowNull: true },
    multiplier: { type: Sequelize.INTEGER, allowNull: true },
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

module.exports = salarypolicyModel;