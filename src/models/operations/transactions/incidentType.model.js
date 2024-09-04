const Sequelize = require('sequelize');
// const {CenterModel, VehicleDetailModel, UserModel } = require('../../index');
const sequelize = require('../../../config/db');


const incidentTypes = sequelize.define('t_incident_type', {
	id:{
		type:Sequelize.INTEGER,
		autoIncrement:true,
		primaryKey:true
	},
	name: { type: Sequelize.STRING(100), allowNull:false },
	isActive: { type: Sequelize.BOOLEAN, allowNull:false, defaultValue:true },
    createdBy:{	type:Sequelize.INTEGER, allowNull:false},
    updatedBy:{	type:Sequelize.INTEGER,allowNull:true},
	createdAt:{ type:Sequelize.DATE, allowNull:false},
	updatedAt: { type:Sequelize.DATE, allowNull:true}
});

module.exports = incidentTypes;