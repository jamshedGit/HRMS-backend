const Sequelize = require('sequelize');
const { ResourceModel } = require('../../..');

//import Database connection configurations.
const sequelize = require('../../../config/db');

const SubsidiaryModel = require('../subsidiary/subsidiary.model');
const { LeaveTypeModel } = require('../..');

const Att_Model = sequelize.define('t_attendance_configuration', {
	Id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	subsidiaryId: { type: Sequelize.INTEGER, allowNull: true, defaultValue: true },
	companyId: { type: Sequelize.INTEGER, allowNull: true, defaultValue: true },
	leave_typeId: { type: Sequelize.INTEGER, allowNull: true },
	late_count_leave_deduction: { type: Sequelize.INTEGER, allowNull: true, defaultValue: true },
	isEnable_att_integration: { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: true },
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




Att_Model.belongsTo(SubsidiaryModel, {
	foreignKey: 'subsidiaryId',
	as: "subs",
	targetKey: 'Id',  // Assuming 'Id' is the primary key in FormModel table
	onDelete: 'RESTRICT',
	onUpdate: 'CASCADE',
});

//  -- This is include in leaveTypeModel due to some issue for sync here

// Att_Model.belongsTo(LeaveTypeModel, {
// 	foreignKey: 'leave_typeId',
// 	targetKey: 'Id',  // Assuming 'Id' is the primary key in FormModel table
// 	onDelete: 'RESTRICT',
// 	onUpdate: 'CASCADE',
// });





module.exports = Att_Model;