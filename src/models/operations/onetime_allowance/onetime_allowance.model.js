const Sequelize = require('sequelize');
const { ResourceModel } = require('../..');

//import Database connection configurations.
const sequelize = require('../../../config/db')

const OnetimeAllowance = sequelize.define('t_onetime_earning', {
	Id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	
	employeeId: { type: Sequelize.INTEGER, allowNull: true },
	earning_Id: { type: Sequelize.INTEGER, allowNull: true },
    amount : { type: Sequelize.DECIMAL, allowNull: true },
    month : { type: Sequelize.DATE, allowNull: true },
    remarks : { type: Sequelize.STRING, allowNull: true },
	transactionType : { type: Sequelize.STRING, allowNull: true },
    


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

module.exports = OnetimeAllowance;