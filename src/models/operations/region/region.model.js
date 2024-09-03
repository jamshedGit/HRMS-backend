const Sequelize = require('sequelize');
const { ResourceModel } = require('../..');

//import Database connection configurations.
const sequelize = require('../../../config/db')

const RegionModel = sequelize.define('T_REGION', {
	Id:{
		type:Sequelize.INTEGER,
		autoIncrement:true,
		primaryKey:true
	},
	regionName: { type: Sequelize.STRING, allowNull:true },
    regionCode: { type: Sequelize.STRING, allowNull:true },

	 isActive: { type: Sequelize.BOOLEAN, allowNull:true, defaultValue: true },
    createdBy:{
		type:Sequelize.INTEGER,
		allowNull:true,
	},
    updatedBy:{
		type:Sequelize.INTEGER,
		allowNull:true,
	},
	createdAt: { type: Sequelize.DATE, allowNull: true },
    updatedAt: { type: Sequelize.DATE, allowNull: true },
	
});



module.exports = RegionModel;