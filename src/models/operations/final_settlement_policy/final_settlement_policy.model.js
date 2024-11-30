const Sequelize = require('sequelize');
const { ResourceModel } = require('../..');

//import Database connection configurations.
const sequelize = require('../../../config/db')

const FinalSettlementModel = sequelize.define('t_final_settlement_policy', {
	Id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	
	companyId: { type: Sequelize.INTEGER, allowNull: true },
    subsidiaryId: { type: Sequelize.INTEGER, allowNull: true },
	// isMonthDays: { type: Sequelize.BO, allowNull: true },
    type: { type: Sequelize.STRING, allowNull: true },
   	value : { type: Sequelize.INTEGER, allowNull: true },
    divisor: { type: Sequelize.INTEGER, allowNull: true },
    multiplier : { type: Sequelize.INTEGER, allowNull: true },
    earning_Id: { type: Sequelize.INTEGER, allowNull: true },


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

module.exports = FinalSettlementModel;