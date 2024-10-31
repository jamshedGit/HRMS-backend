const Sequelize = require('sequelize');
const { ResourceModel } = require('../..');

//import Database connection configurations.
const sequelize = require('../../../config/db')

const FormConfigModel = sequelize.define('t_form_menu_configuration', {
	Id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	formName: { type: Sequelize.STRING, allowNull: true },
	formCode: { type: Sequelize.STRING, allowNull: true },
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

module.exports = FormConfigModel;