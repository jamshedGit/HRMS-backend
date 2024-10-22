const Sequelize = require('sequelize');
const { ResourceModel } = require('../../..');

//import Database connection configurations.
const sequelize = require('../../../config/db')

const Model = sequelize.define('tran_email_recipents_setup', {
	Id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	
    subsidiaryId : { type: Sequelize.INTEGER, allowNull: true, defaultValue: true },
    companyId  : { type: Sequelize.INTEGER, allowNull: true, defaultValue: true },
    payrollConfigurationId : { type: Sequelize.INTEGER, allowNull: true, defaultValue: true },
    employeeId: { type: Sequelize.INTEGER, allowNull: true, defaultValue: true },
    email_sender_Id : { type: Sequelize.INTEGER, allowNull: true, defaultValue: true },
	createdAt: { type: Sequelize.DATE, allowNull: true },
	updatedAt: { type: Sequelize.DATE, allowNull: true },

});

module.exports = Model;