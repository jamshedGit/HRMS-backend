const Sequelize = require('sequelize');
const sequelize = require('../../../config/db')

const expenseCategories = sequelize.define('T_EXPENSE_CATEGORIES', {
	id:{
		type:Sequelize.INTEGER,
		autoIncrement:true,
		primaryKey:true
	},
	name: { type: Sequelize.STRING(50), allowNull:true },
    previousPrice: { type: Sequelize.STRING(20), allowNull:true, },
    currentPrice: { type: Sequelize.STRING(50), allowNull:true },
	slug: { type: Sequelize.STRING, allowNull:true },
	isActive: { type: Sequelize.BOOLEAN, allowNull:false, defaultValue: true },
    createdBy:{	type:Sequelize.INTEGER, allowNull:false},
    updatedBy:{	type:Sequelize.INTEGER,allowNull:true},
	createdAt:{ type:Sequelize.DATE, allowNull:false},
	updatedAt: { type:Sequelize.DATE, allowNull:true}
});



module.exports = expenseCategories;