const Sequelize = require('sequelize');
const { ResourceModel } = require('../../..');
const { DataTypes } = require('sequelize');
//import Database connection configurations.
const sequelize = require('../../../config/db')

const DeductionModel = sequelize.define('t_employee_deduction', {
	Id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	
	deductionCode : { type: Sequelize.STRING, allowNull: true, defaultValue: true },
	deductionName : { type: Sequelize.STRING, allowNull: true, defaultValue: true },
	linkedAttendance : { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: true },
	loan: { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: true },
	mappedDeduction : { type: Sequelize.STRING, allowNull: true, defaultValue: true },
	account : { type: Sequelize.INTEGER, allowNull: true, defaultValue: true },
	// subsidiaryId : { type: Sequelize.NUMBER, allowNull: true, defaultValue: true },
	companyId : { type: Sequelize.NUMBER, allowNull: true, defaultValue: true },
	isActive: { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: true },
	subsidiaryId: {
		type: DataTypes.JSON,
		allowNull: true,
		set(value) {
		  this.setDataValue('subsidiaryId', value.map((v) => Number(v)));
		},
		get() {
		  const storedValue = this.getDataValue('subsidiaryId');
		  if (storedValue && typeof storedValue == 'string') {
			return JSON.parse(storedValue).map((v) => String(v));
		  }
		  return storedValue;
		}
	  },
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

module.exports = DeductionModel;