const Sequelize = require('sequelize');
const { ResourceModel } = require('../..');

//import Database connection configurations.
const sequelize = require('../../../config/db')

const DesigModel = sequelize.define('t_designation', {
	Id:{
		type:Sequelize.INTEGER,
		autoIncrement:true,
		primaryKey:true
	},
	designationName: { type: Sequelize.STRING, allowNull:true },
	designationCode: { type: Sequelize.STRING, allowNull:true },
	probationInMonth: { type: Sequelize.NUMBER, allowNull:true },
   

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



module.exports = DesigModel;