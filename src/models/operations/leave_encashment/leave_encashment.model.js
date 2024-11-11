const Sequelize = require('sequelize');

//import Database connection configurations.
const sequelize = require('../../../config/db');
const { EmployeeProfileModel, LeaveTypeModel, CompanyModel, SubsidiaryModel, FiscalSetupModel, PayrollMonthModel } = require('../..');

const leaveEnchasmentModel = sequelize.define('t_leave_encashment', {
  Id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  subsidiaryId: { type: Sequelize.INTEGER, allowNull: true },
  companyId: { type: Sequelize.INTEGER, allowNull: true },
  employeeId: { type: Sequelize.INTEGER, allowNull: false },
  leaveType: { type: Sequelize.INTEGER, allowNull: false },
  yearId: { type: Sequelize.INTEGER, allowNull: false },
  payrollMonthId: { type: Sequelize.INTEGER, allowNull: true },
  days: { type: Sequelize.FLOAT, allowNull: false,
    get() {
			const rawValue = this.getDataValue('days');
			return typeof rawValue != 'undefined' ? Number(rawValue) : null;
		}
   },
  reason: { type: Sequelize.STRING, allowNull: true },
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

// Association with EmployeeProfileModel model (employeeId is a foreign key)
EmployeeProfileModel.hasMany(leaveEnchasmentModel, { foreignKey: 'employeeId' });
leaveEnchasmentModel.belongsTo(EmployeeProfileModel, {
  foreignKey: 'employeeId',
  targetKey: 'Id',  // Assuming 'Id' is the primary key in EmployeeProfileModel table
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE',
});

// // Association with LeaveTypeModel model (employeeId is a foreign key)
leaveEnchasmentModel.belongsTo(LeaveTypeModel, {
  foreignKey: 'leaveType',
  targetKey: 'Id',  // Assuming 'Id' is the primary key in LeaveTypeModel table
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE',
});

// // Association with SubsidiaryModel model (subsidiaryId is a foreign key)
SubsidiaryModel.hasMany(leaveEnchasmentModel, { foreignKey: 'subsidiaryId' });
leaveEnchasmentModel.belongsTo(SubsidiaryModel, {
  foreignKey: 'subsidiaryId',
  targetKey: 'Id',  // Assuming 'Id' is the primary key in SubsidiaryModel table
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE',
});

// // Association with PayrollMonthModel model (payrollMonthId is a foreign key)
PayrollMonthModel.hasMany(leaveEnchasmentModel, { foreignKey: 'payrollMonthId' });
leaveEnchasmentModel.belongsTo(PayrollMonthModel, {
  foreignKey: 'payrollMonthId',
  targetKey: 'Id',  // Assuming 'Id' is the primary key in PayrollMonthModel table
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE',
});

// Association with FiscalSetupModel model (yearId is a foreign key)
leaveEnchasmentModel.belongsTo(FiscalSetupModel, {
  foreignKey: 'yearId',
  targetKey: 'Id',  // Assuming 'Id' is the primary key in FiscalSetupModel table
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE',
});

//This hook will be triggered whenever a new record is created in Leave Encashment table that will set current Active Payroll Month Id in payrollMonthId key in Encashment Record
leaveEnchasmentModel.beforeCreate(async (record, options) => {
  // Find the active record in PayrollMonthModel
  const activeRecord = await PayrollMonthModel.findOne({
    where: { isActive: true },
    attributes: ['Id']
  });

  if (activeRecord) {
    // Set the payrollMonthId in leaveEnchasmentModel to the id of the active record in PayrollMonthModel
    record.payrollMonthId = activeRecord.Id;
  }
});

module.exports = leaveEnchasmentModel;
