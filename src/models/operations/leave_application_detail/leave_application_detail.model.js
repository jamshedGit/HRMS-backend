const Sequelize = require('sequelize');

//import Database connection configurations.
const sequelize = require('../../../config/db');
const { EmployeeProfileModel, LeaveTypeModel, LeaveApplicationModel } = require('../..');

const leaveApplicationDetailModel = sequelize.define('t_leave_application_detail', {
	Id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	applicationId: { type: Sequelize.INTEGER, allowNull: false },
	date: { type: Sequelize.DATE, allowNull: false },
	isActive: { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: 1 },
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

// Association with leaveApplicationModel model (employeeId is a foreign key)
LeaveApplicationModel.hasMany(leaveApplicationDetailModel, { foreignKey: 'applicationId' });
leaveApplicationDetailModel.belongsTo(LeaveApplicationModel, {
	foreignKey: 'applicationId',
	targetKey: 'Id',  // Assuming 'Id' is the primary key in leaveApplicationModel table
	onDelete: 'CASCADE',
	onUpdate: 'CASCADE',
});

module.exports = leaveApplicationDetailModel;
