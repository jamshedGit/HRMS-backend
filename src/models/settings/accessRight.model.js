const Sequelize = require('sequelize')
// Import sequelize object,
// Database connection pool managed by Sequelize.
const sequelize = require('../../config/db')
const { RoleModel, ResourceModel } = require('../index');

// Define method takes two arguments
// 1st - name of table
// 2nd - columns inside the table
const accessRight = sequelize.define('t_access_rights', {
	id:{
		type:Sequelize.INTEGER,
		autoIncrement:true,
		primaryKey:true
	},
	// name: { type: Sequelize.STRING, allowNull:true },
	// slug: { type: Sequelize.STRING, allowNull:true },
	isAccess: { type: Sequelize.BOOLEAN, allowNull:true, defaultValue: false },
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

accessRight.belongsTo(ResourceModel,{
    foreignKey:'resourceId',
    onDelete:'CASCADE',
    onUpdate:'CASCADE',
});

accessRight.belongsTo(RoleModel,{
    foreignKey:'roleId',
    onDelete:'CASCADE',
    onUpdate:'CASCADE',
});

// accessRight.belongsTo(AccessModel,{
//     foreignKey:'accessId',
//     onDelete:'CASCADE',
//     onUpdate:'CASCADE',
// });

// Exporting User, using this constant
// we can perform CRUD operations on
// 'user' table.
module.exports = accessRight
