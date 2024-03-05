const Sequelize = require('sequelize');
const { ResourceModel } = require('../..');

//import Database connection configurations.
const sequelize = require('../../../config/db')

const vehicleCategories = sequelize.define('T_VEHICLE_CATEGORIES', {
	id:{
		type:Sequelize.INTEGER,
		autoIncrement:true,
		primaryKey:true
	},
	name: { type: Sequelize.STRING, allowNull:true },
	slug: { type: Sequelize.STRING, allowNull:true },
	isActive: { type: Sequelize.BOOLEAN, allowNull:true, defaultValue: true },
    createdBy:{
		type:Sequelize.INTEGER,
		allowNull:true,
	},
    updatedBy:{
		type:Sequelize.INTEGER,
		allowNull:true,
	},
	// Timestamps
	createdAt: Sequelize.DATE,
	updatedAt: Sequelize.DATE,
});



module.exports = vehicleCategories;