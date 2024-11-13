const Sequelize = require('sequelize');
const { ResourceModel } = require('../../..');

//import Database connection configurations.
const sequelize = require('../../../config/db');

const SubsidiaryModel = require('../subsidiary/subsidiary.model');
const { LeaveTypeModel } = require('../..');

const Model = sequelize.define('t_employee_shift', {
	Id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	subsidiaryId: { type: Sequelize.INTEGER, allowNull: false },
	companyId: { type: Sequelize.INTEGER, allowNull: false },
	name: { type: Sequelize.STRING, allowNull: true },
	shiftCode: { type: Sequelize.STRING, allowNull: true },
	shiftType: { type: Sequelize.STRING, allowNull: true },
	startTime: { type: Sequelize.STRING, allowNull: true },
	endTime: { type: Sequelize.STRING, allowNull: true },
	workingdays: { type: Sequelize.STRING, allowNull: true },
	earlyIn: { type: Sequelize.STRING, allowNull: true },
	earlyOut: { type: Sequelize.STRING, allowNull: true },
	halfDayStart: { type: Sequelize.STRING, allowNull: true },
	halfDayEnd: { type: Sequelize.STRING, allowNull: true },
	breakTimeStart: { type: Sequelize.STRING, allowNull: true },
	breakTimeEnd: { type: Sequelize.STRING, allowNull: true },
	isOverTime: { type: Sequelize.BOOLEAN, allowNull: true },
	overTimeStart: { type: Sequelize.STRING, allowNull: true },
	interShiftGap: { type: Sequelize.INTEGER, allowNull: true },
	isIncludeInterShifGap: { type: Sequelize.BOOLEAN, allowNull: true },
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




Model.belongsTo(SubsidiaryModel, {
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





module.exports = Model;