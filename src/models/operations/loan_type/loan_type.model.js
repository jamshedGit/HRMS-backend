const Sequelize = require('sequelize');
const { ResourceModel } = require('../../..');
const { DataTypes } = require('sequelize');
//import Database connection configurations.
const sequelize = require('../../../config/db');
const { SubsidiaryModel, FormModel } = require('../..');

const Model = sequelize.define('t_loan_type_setup', {
	Id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	code : { type: Sequelize.STRING(6), allowNull: true, defaultValue: true },
	name  : { type: Sequelize.STRING(50), allowNull: true, defaultValue: true },
	//linkedAttendance : { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: true },
	accountId : { type: Sequelize.INTEGER, allowNull: true, defaultValue: true },
	// subsidiaryId : { type: Sequelize.INTEGER, allowNull: true, defaultValue: true },
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
	companyId : { type: Sequelize.INTEGER, allowNull: true },
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


// Model.belongsTo(SubsidiaryModel, {
// 	foreignKey: 'subsidiaryId',
// 	targetKey: 'Id',
// 		as:"subsList"
//   });

  
  Model.belongsTo(FormModel, {
	foreignKey: 'accountId',
	targetKey: 'Id',
	as:"LoanTypeAccount"
  });


module.exports = Model;