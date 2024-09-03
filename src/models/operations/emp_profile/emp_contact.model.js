const Sequelize = require('sequelize');
const { ResourceModel } = require('../..');

//import Database connection configurations.
const sequelize = require('../../../config/db')

const DesigModel = sequelize.define('T_Contact_Information', {
	Id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	relation: { type: Sequelize.NUMBER, allowNull: true },
	relation_name: { type: Sequelize.STRING, allowNull: true },
	contactNo: { type: Sequelize.STRING, allowNull: true },
	employeeId: { type: Sequelize.STRING, allowNull: true },
	
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



module.exports = DesigModel;