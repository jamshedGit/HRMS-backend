const Sequelize = require('sequelize');
const { ResourceModel } = require('../..');

//import Database connection configurations.
const sequelize = require('../../../config/db')

const FormModel = sequelize.define('T_FORM_MENU', {
	Id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	formName: { type: Sequelize.STRING, allowNull: true },
	formCode: { type: Sequelize.STRING, allowNull: true },
	parentFormID: { type: Sequelize.NUMBER, allowNull: true },
	level: { type: Sequelize.NUMBER, allowNull: true },
	isDeleted: { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: true },
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



module.exports = FormModel;