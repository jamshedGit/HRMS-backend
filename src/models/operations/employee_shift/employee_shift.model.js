const Sequelize = require('sequelize');

//import Database connection configurations.
const sequelize = require('../../../config/db');

const SubsidiaryModel = require('../subsidiary/subsidiary.model');
const {  FormModel } = require('../..');

const Model = sequelize.define('t_employee_shift', {
	Id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	subsidiaryId: { type: Sequelize.INTEGER, allowNull: false },
	companyId: { type: Sequelize.INTEGER, allowNull: false },
	name: { type: Sequelize.STRING(50), allowNull: true },
	shiftCode: { type: Sequelize.STRING(8), allowNull: true },
	shiftType: { type: Sequelize.INTEGER, allowNull: true },
	startTime: { type: Sequelize.STRING(4), allowNull: true },
	endTime: { type: Sequelize.STRING(4), allowNull: true },
	workingdays: { type: Sequelize.STRING(250), allowNull: true }
	,
	earlyIn: { type: Sequelize.STRING(4), allowNull: true },
	earlyOut: { type: Sequelize.STRING(4), allowNull: true },
	halfDayStart: { type: Sequelize.STRING(4), allowNull: true },
	halfDayEnd: { type: Sequelize.STRING(4), allowNull: true },
	breakTimeStart: { type: Sequelize.STRING(4), allowNull: true },
	breakTimeEnd: { type: Sequelize.STRING(4), allowNull: true },
	isOverTime: { type: Sequelize.BOOLEAN, allowNull: true },
	overTimeStart: { type: Sequelize.STRING(4), allowNull: true },
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
	isActive: { type: Sequelize.BOOLEAN, allowNull: true ,defaultValue: true},
},
{
  indexes: [
	{
	  name: 't_shiftype_indexes',
	  unique: true,
	  fields: ['subsidiaryId', 'companyId', 'shiftCode']
	},
	
  ]
});


Model.belongsTo(SubsidiaryModel, {
	foreignKey: 'subsidiaryId',
	as: "subs",
	targetKey: 'Id',  // Assuming 'Id' is the primary key in FormModel table
	onDelete: 'RESTRICT',
	onUpdate: 'CASCADE',
});


// Association with FormModel model (gender is a foreign key)
Model.belongsTo(FormModel, {
	foreignKey: 'shiftType',
	targetKey: 'Id', // Assuming 'Id' is the primary key in FormMenu table
	as: 'shiftTypeList',
	onDelete: 'CASCADE',
	onUpdate: 'CASCADE',
  });
  

module.exports = Model;