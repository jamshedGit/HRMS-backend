const Sequelize = require('sequelize')
const { tokenTypes } = require('../config/tokens');


// Import sequelize object,
// Database connection pool managed by Sequelize.
const sequelize = require('../config/db')
const { UserModel } = require('./index');

// Define method takes two arguments
// 1st - name of table
// 2nd - columns inside the table
const token = sequelize.define('T_TOKENS', {
	id:{
		type:Sequelize.INTEGER,
		autoIncrement:true,
		allowNull:false,
		primaryKey:true
	},
	token: { type: Sequelize.STRING, allowNull:true },
    type: {
        type: Sequelize.ENUM(tokenTypes.REFRESH, tokenTypes.RESET_PASSWORD, tokenTypes.VERIFY_EMAIL),
        required: true,
        // defaultValue: "pending",
      },
	blacklisted: { type: Sequelize.BOOLEAN, allowNull:true },
    expires: { type: Sequelize.DATE, required:true },
	// Timestamps
	createdAt: Sequelize.DATE,
	updatedAt: Sequelize.DATE,
})

token.belongsTo(UserModel,{
    foreignKey:'userId',
    onDelete:'CASCADE',
    onUpdate:'CASCADE',
});

// Exporting User, using this constant
// we can perform CRUD operations on
// 'user' table.
module.exports = token
