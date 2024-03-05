const Sequelize = require('sequelize');
const { ResourceModel, UserModel } = require('../..');
const sequelize = require('../../../config/db');
//const centers = require('../entities/centers.model');

const transactionsMaster = sequelize.define('T_TRANSACTIONS_MASTER', {
	id:{
		type:Sequelize.INTEGER,
		autoIncrement:true,
		primaryKey:true
	},
	transactionDate: { type: Sequelize.DATE, allowNull:true },
    narration: { type: Sequelize.STRING(70), allowNull:true },
    receiptNo: { type: Sequelize.STRING(30), allowNull:true },
	slug: { type: Sequelize.STRING, allowNull:true },
	isActive: { type: Sequelize.BOOLEAN, allowNull:false, defaultValue: true },
    createdBy:{	type:Sequelize.INTEGER, allowNull:false},
    updatedBy:{	type:Sequelize.INTEGER,allowNull:true},
	createdAt:{ type:Sequelize.DATE, allowNull:false},
	updatedAt: { type:Sequelize.DATE, allowNull:true}
});

module.exports = transactionsMaster;