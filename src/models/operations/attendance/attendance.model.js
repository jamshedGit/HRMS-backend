const Sequelize = require('sequelize');
//import Database connection configurations.
const sequelize = require('../../../config/db');
const { EmployeeProfileModel, SubsidiaryModel, CompanyModel } = require('../..');

const attendanceModel = sequelize.define('t_attendance', {
  Id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  subsidiaryId: { type: Sequelize.INTEGER, allowNull: true },
  companyId: { type: Sequelize.INTEGER, allowNull: true },
  employeeId: { type: Sequelize.INTEGER, allowNull: false },
  employeeCode: { type: Sequelize.STRING(10), allowNull: true },
  comments: { type: Sequelize.STRING(100), allowNull: true },
  attDate: { type: Sequelize.DATE, allowNull: true },
  attDateIn: { type: Sequelize.DATE, allowNull: true },
  attDateOut: { type: Sequelize.DATE, allowNull: true },
  timeIn: { type: Sequelize.STRING(4), allowNull: true },
  timeOut: { type: Sequelize.STRING(4), allowNull: true },
  machineTimeIn: { type: Sequelize.STRING(4), allowNull: true },
  machineTimeOut: { type: Sequelize.STRING(4), allowNull: true },
  timeDiff: { type: Sequelize.STRING(4), allowNull: true },
  oT: { type: Sequelize.STRING(10), allowNull: true },
  approvedOT: { type: Sequelize.STRING(10), allowNull: true },
  approved: { type: Sequelize.BOOLEAN, allowNull: true },
  attendanceCode: { type: Sequelize.STRING(3), allowNull: true },
  dayStatus: { type: Sequelize.STRING(4), allowNull: true },
  access: { type: Sequelize.STRING(1), allowNull: true },
  shiftCode: { type: Sequelize.STRING(3), allowNull: true },
  shiftDescription: { type: Sequelize.STRING(100), allowNull: true },
  shiftStartTime: { type: Sequelize.STRING(4), allowNull: true },
  shiftEndTime: { type: Sequelize.STRING(4), allowNull: true },
  shiftDateTimeIn: { type: Sequelize.DATE, allowNull: true },
  shiftDateTimeOut: { type: Sequelize.DATE, allowNull: true },
  shiftWorkingHours: { type: Sequelize.STRING(4), allowNull: true },
  shiftLateIn: { type: Sequelize.STRING(4), allowNull: true },
  shiftEarlyOut: { type: Sequelize.STRING(4), allowNull: true },
  shiftHalfDayStart: { type: Sequelize.STRING(4), allowNull: true },
  shiftHalfDayEnd: { type: Sequelize.STRING(4), allowNull: true },
  breakStart: { type: Sequelize.STRING(4), allowNull: true },
  breakEnd: { type: Sequelize.STRING(4), allowNull: true },
  isOverTime: { type: Sequelize.BOOLEAN, allowNull: true },
  overtimeStart: { type: Sequelize.STRING(4), allowNull: true },
  interShifGap: { type: Sequelize.STRING(30), allowNull: true },
  isIncludeInterShifGap: { type: Sequelize.BOOLEAN, allowNull: true },
  isRosterShift: { type: Sequelize.BOOLEAN, allowNull: true },
  isOnTime: { type: Sequelize.BOOLEAN, allowNull: true },
  isLateComing: { type: Sequelize.BOOLEAN, allowNull: true },
  isEarlyGoing: { type: Sequelize.BOOLEAN, allowNull: true },
  isHalfDay: { type: Sequelize.BOOLEAN, allowNull: true },
  isOffDay: { type: Sequelize.BOOLEAN, allowNull: true },
  isHoliday: { type: Sequelize.BOOLEAN, allowNull: true },
  isOnLeave: { type: Sequelize.BOOLEAN, allowNull: true },
  isPartialLeave: { type: Sequelize.BOOLEAN, allowNull: true },
  leaveCode: { type: Sequelize.STRING(3), allowNull: true },
  workedHours: { type: Sequelize.STRING(4), allowNull: true },
  totalShortHours: { type: Sequelize.STRING(4), allowNull: true },
  paidDays: { type: Sequelize.FLOAT, allowNull: true },
  paidLeaveDays: { type: Sequelize.FLOAT, allowNull: true },
  nonPaidLeaveDays: { type: Sequelize.FLOAT, allowNull: true },
  workedMinute: { type: Sequelize.FLOAT, allowNull: true },
  lateInHours: { type: Sequelize.STRING(4), allowNull: true },
  earlyOutHours: { type: Sequelize.STRING(4), allowNull: true },
  breakHours: { type: Sequelize.STRING(4), allowNull: true },
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
},
  {
    indexes: [
      {
        name: 't_AttendanceProcess_UNIQUE',
        unique: true,
        fields: ['subsidiaryId', 'companyId', 'employeeId', 'attDate']
      }
    ]
  });

// Association with EmployeeProfileModel model (employeeId is a foreign key)
EmployeeProfileModel.hasMany(attendanceModel, { foreignKey: 'employeeId' });
attendanceModel.belongsTo(EmployeeProfileModel, {
  foreignKey: 'employeeId',
  targetKey: 'Id',  // Assuming 'Id' is the primary key in EmployeeProfileModel table
  onDelete: 'RESTRICT',
  onUpdate: 'RESTRICT',
});

// Association with SubsidiaryModel model (subsidiaryId is a foreign key)
SubsidiaryModel.hasMany(attendanceModel, { foreignKey: 'subsidiaryId' });
attendanceModel.belongsTo(SubsidiaryModel, {
  foreignKey: 'subsidiaryId',
  targetKey: 'Id',  // Assuming 'Id' is the primary key in SubsidiaryModel table
  onDelete: 'RESTRICT',
  onUpdate: 'RESTRICT',
});

// Association with CompanyModel model (companyId is a foreign key)
CompanyModel.hasMany(attendanceModel, { foreignKey: 'companyId' });
attendanceModel.belongsTo(CompanyModel, {
  foreignKey: 'companyId',
  targetKey: 'Id',  // Assuming 'Id' is the primary key in CompanyModel table
  onDelete: 'RESTRICT',
  onUpdate: 'RESTRICT',
});

module.exports = attendanceModel;