const Sequelize = require('sequelize')
const { Op } = require("sequelize");
const bcrypt = require('bcryptjs');


// Import sequelize object,
// Database connection pool managed by Sequelize.
const sequelize = require('../config/db')
const { RoleModel, CenterModel, CityModel, CountryModel, SubCenterModel } = require('./index');

// Define method takes two arguments
// 1st - name of table
// 2nd - columns inside the table
const user = sequelize.define('t_users', {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true
	},
	firstName: { type: Sequelize.STRING, allowNull: true },
	lastName: { type: Sequelize.STRING, allowNull: true },
	userName: { type: Sequelize.STRING, allowNull: true },
	email: { type: Sequelize.STRING, allowNull: true },
	password: { type: Sequelize.STRING, required: true, trim: true, private: true },
	cnic: { type: Sequelize.STRING, allowNull: true },
	phNo: { type: Sequelize.STRING, allowNull: true },
	status: {type: Sequelize.STRING, allowNull:true},
	tripStatus: {type: Sequelize.STRING, defalutValue: "Available"},
	isActive: { type: Sequelize.BOOLEAN, allowNull: true, defalutValue: true },
	createdBy: {
		type: Sequelize.INTEGER,
		allowNull: true,
	},
	updatedBy: {
		type: Sequelize.INTEGER,
		allowNull: true,
	},
	// Timestamps
	createdAt: Sequelize.DATE,
	updatedAt: Sequelize.DATE,
})

user.belongsTo(RoleModel, {
	as: 'role',
	foreignKey: 'roleId',
	onDelete: 'CASCADE',
	onUpdate: 'CASCADE',
});

user.belongsTo(CenterModel, {
	as: 'center',
	foreignKey: 'centerId',
	onDelete: 'CASCADE',
	onUpdate: 'CASCADE',
});

user.belongsTo(SubCenterModel, {
	as: 'subcenter',
	foreignKey: 'subCenterId',
	onDelete: 'CASCADE',
	onUpdate: 'CASCADE',
});

user.belongsTo(CountryModel, {
	as: 'country',
	foreignKey: 'countryId',
	onDelete: 'CASCADE',
	onUpdate: 'CASCADE',
});

user.belongsTo(CityModel, {
	as: 'city',
	foreignKey: 'cityId',
	onDelete: 'CASCADE',
	onUpdate: 'CASCADE',
});

// Exporting User, using this constant
// we can perform CRUD operations on
// 'user' table.

// user.prototype.validPassword = async function (password) {
// 	return await bcrypt.compare(password, this.password);
// }

user.isPasswordMatch = (email, password) => user.findOne(
	{
		
		where: { email: email }
	}).then((data) => {
		
		return true; //bcrypt.compare(password, data.password);
	});

user.isEmailTakenOldUser = (email, excludeUserId) => user.findOne(
	{where: {email: email,id: {[Op.ne]: excludeUserId}}
	}).then((data) => {
		return data;
	});

user.isEmailTakenNewUser = (email) => user.findOne(
		{where: {email: email}
		}).then((data) => {
			return data;
	});

user.beforeCreate = (user) => {
	{	// user.password = bcrypt.hash(user.password, 8);
		if(user.password && user.password != "" ){
			user.password = user.password && user.password != "" ? bcrypt.hashSync(user.password, 8) : "";
		}
	}
}

module.exports = user