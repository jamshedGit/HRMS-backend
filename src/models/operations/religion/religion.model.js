const Sequelize = require('sequelize');
const { ResourceModel } = require('../..');

//import Database connection configurations.
const sequelize = require('../../../config/db')

const ReligionModel = sequelize.define('t_religion', {
	Id:{
		type:Sequelize.INTEGER,
		autoIncrement:true,
		primaryKey:true
	},
	religionName: { type: Sequelize.STRING, allowNull:true },
    religionCode: { type: Sequelize.STRING, allowNull:true },

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



module.exports = ReligionModel;