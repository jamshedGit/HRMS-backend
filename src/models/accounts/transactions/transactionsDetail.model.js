const Sequelize = require('sequelize');
const {VehicleDetailModel,UserModel,IncidentDetailModel, TransactionMasterModel } = require('../../index');
const sequelize = require('../../../config/db');
//const centers = require('../entities/centers.model');

const transactionsDetail = sequelize.define('T_TRANSACTIONS_DETAIL', {
	id:{
		type:Sequelize.INTEGER,
		autoIncrement:true,
		primaryKey:true
	},
	types: { type: Sequelize.STRING(70), allowNull:true },
    price: { type: Sequelize.DOUBLE, allowNull:true },
    unit: { type: Sequelize.STRING(30), allowNull:true },
	slug: { type: Sequelize.STRING, allowNull:true },
	isActive: { type: Sequelize.BOOLEAN, allowNull:false, defaultValue: true },
    createdBy:{	type:Sequelize.INTEGER, allowNull:false},
    updatedBy:{	type:Sequelize.INTEGER,allowNull:true},
	createdAt:{ type:Sequelize.DATE, allowNull:false},
	updatedAt: { type:Sequelize.DATE, allowNull:true},
});

transactionsDetail.belongsTo(TransactionMasterModel,{
    foreignKey:'transactionMasterId',
    onDelete:'RESTRICT',
    onUpdate:'CASCADE',
});

transactionsDetail.belongsTo(VehicleDetailModel,{
    foreignKey:'vehicleId',
    onDelete:'RESTRICT',
    onUpdate:'CASCADE',
});

transactionsDetail.belongsTo(UserModel,{
    foreignKey:'driverId',
    onDelete:'RESTRICT',
    onUpdate:'CASCADE',
});

transactionsDetail.belongsTo(IncidentDetailModel,{
    foreignKey:'incidentId',
    onDelete:'RESTRICT',
    onUpdate:'CASCADE',
});


module.exports = transactionsDetail;