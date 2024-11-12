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
	subsidiaryId: { type: Sequelize.INTEGER, allowNull: true },
    companyId : { type: Sequelize.INTEGER, allowNull: true },
    name : { type: Sequelize.STRING, allowNull: true},
    shiftCode : { type: Sequelize.STRING, allowNull: true},
    startTime : { type: Sequelize.DATE, allowNull: true },
    endTime   : { type: Sequelize.DATE, allowNull: true },
    workingdays  : { type: Sequelize.INTEGER, allowNull: true },
    lateIn  : { type: Sequelize.DATE, allowNull: true },
    lateOut  : { type: Sequelize.DATE, allowNull: true },
    halfDayStart  : { type: Sequelize.DATE, allowNull: true },
    halfDayEnd  : { type: Sequelize.DATE, allowNull: true },
    breakStartTime  : { type: Sequelize.DATE, allowNull: true },
    breakEndTime  : { type: Sequelize.DATE, allowNull: true },
    isOverTime: { type: Sequelize.BOOLEAN, allowNull: true },
    overStartTime  : { type: Sequelize.DATE, allowNull: true },
    interShifGap: { type: Sequelize.STRING, allowNull: true },
    isIncludeInterShifGap : { type: Sequelize.BOOLEAN, allowNull: true },
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