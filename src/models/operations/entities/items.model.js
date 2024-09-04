const Sequelize = require('sequelize');
const { ResourceModel } = require('../..');
const sequelize = require('../../../config/db')

const items = sequelize.define('t_items', {
	id:{
		type:Sequelize.INTEGER,
		autoIncrement:true,
		primaryKey:true
	},
	name: { type: Sequelize.STRING(70), allowNull:true },
    isPriceList: { type: Sequelize.BOOLEAN, allowNull:true, defaultValue: true},
	slug: { type: Sequelize.STRING, allowNull:true },
	isActive: { type: Sequelize.BOOLEAN, allowNull:false, defaultValue: true},
    createdBy:{	type:Sequelize.INTEGER, allowNull:false},
    updatedBy:{	type:Sequelize.INTEGER,allowNull:true},
	createdAt:{ type:Sequelize.DATE, allowNull:false},
	updatedAt: { type:Sequelize.DATE, allowNull:true}
});



module.exports = items;