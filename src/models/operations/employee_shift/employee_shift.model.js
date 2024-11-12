const Sequelize = require('sequelize');
const { ResourceModel } = require('../../..');

//import Database connection configurations.
const sequelize = require('../../../config/db');

const SubsidiaryModel = require('../subsidiary/subsidiary.model');
const { LeaveTypeModel } = require('../..');

const Att_Model = sequelize.define('t_employee_shift', {
	Id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	subsidiaryId: { type: Sequelize.INTEGER, allowNull: true, defaultValue: true },
    companyId : { type: Sequelize.INTEGER, allowNull: true, defaultValue: true },
    name : { type: Sequelize.STRING, allowNull: true, defaultValue: true },
    shiftCode : { type: Sequelize.STRING, allowNull: true, defaultValue: true },
    startTime : { type: Sequelize.DATE, allowNull: true, defaultValue: true },
    endTime   : { type: Sequelize.DATE, allowNull: true, defaultValue: true },
    workingdays  : { type: Sequelize.INTEGER, allowNull: true, defaultValue: true },
    lateIn  : { type: Sequelize.DATE, allowNull: true, defaultValue: true },
    lateOut  : { type: Sequelize.DATE, allowNull: true, defaultValue: true },
    halfDayStart  : { type: Sequelize.DATE, allowNull: true, defaultValue: true },
    halfDayEnd  : { type: Sequelize.DATE, allowNull: true, defaultValue: true },
    breakStartTime  : { type: Sequelize.DATE, allowNull: true, defaultValue: true },
    breakEndTime  : { type: Sequelize.DATE, allowNull: true, defaultValue: true },
    isOverTime: { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: true },
    overStartTime  : { type: Sequelize.DATE, allowNull: true, defaultValue: true },
    interShifGap: { type: Sequelize.STRING, allowNull: true, defaultValue: true },
    isIncludeInterShifGap : { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: true },
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