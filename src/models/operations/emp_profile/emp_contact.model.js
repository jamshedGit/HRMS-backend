const Sequelize = require('sequelize');
const { EmployeeProfileModel } = require('../..');

//import Database connection configurations.
const sequelize = require('../../../config/db')

const EmployeeContactModel = sequelize.define('t_contact_information', {
	Id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	relation: { type: Sequelize.INTEGER, allowNull: true },
	relation_name: { type: Sequelize.STRING, allowNull: true },
	contactNo: { type: Sequelize.STRING, allowNull: true },
	employeeId: { type: Sequelize.INTEGER, allowNull: true },
	isActive: { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: true },
	createdBy: {
		type: Sequelize.INTEGER,
		allowNull: true,
	},
	updatedBy: {
		type: Sequelize.INTEGER,
		allowNull: true,
	},
	createdAt: { type: Sequelize.DATE, allowNull: true },
	updatedAt: { type: Sequelize.DATE, allowNull: true },

});

EmployeeProfileModel.hasMany(EmployeeContactModel, { foreignKey: 'employeeId' });
EmployeeContactModel.belongsTo(EmployeeProfileModel, {
    foreignKey: 'employeeId',
    targetKey: 'Id', 
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
});

module.exports = EmployeeContactModel;