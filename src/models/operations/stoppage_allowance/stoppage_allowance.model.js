const Sequelize = require('sequelize');
const { ResourceModel } = require('../../..');

//import Database connection configurations.
const sequelize = require('../../../config/db')

const StoppageAllowanceModel = sequelize.define('t_temporary_stoppage_allowance', {
	Id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	
	earning_deduction_type: { type: Sequelize.STRING, allowNull: true, defaultValue: true },
    earning_deduction_Id: { type: Sequelize.NUMBER, allowNull: true, defaultValue: true },
    startDate : { type: Sequelize.DATE, allowNull: true, defaultValue: true },
    endDate : { type: Sequelize.DATE, allowNull: true, defaultValue: true },
    remarks : { type: Sequelize.STRING, allowNull: true, defaultValue: true },
	isActive: { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: true },
	createdBy : {
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

module.exports = StoppageAllowanceModel;