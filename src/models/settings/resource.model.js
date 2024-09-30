const Sequelize = require('sequelize')

// Import sequelize object,
// Database connection pool managed by Sequelize.
const sequelize = require('../../config/db')

// Define method takes two arguments
// 1st - name of table
// 2nd - columns inside the table
const resource = sequelize.define('t_resources', {
	id:{
		type:Sequelize.INTEGER,
		autoIncrement:true,
		allowNull:false,
		primaryKey:true
	},
	name: { type: Sequelize.STRING, allowNull:true },
	parentName: { type: Sequelize.STRING, allowNull:true },
	parentSlug: { type: Sequelize.STRING, allowNull:true },
	slug: { type: Sequelize.STRING, allowNull:true },
	sortOrder: { type: Sequelize.INTEGER, allowNull:true },
	isResourceShow: { type: Sequelize.BOOLEAN, allowNull:true, defaultValue: false },
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
})

// Exporting User, using this constant
// we can perform CRUD operations on
// 'user' table.
module.exports = resource
