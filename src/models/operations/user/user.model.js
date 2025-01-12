const Sequelize = require('sequelize')
const { Op } = require("sequelize");
const bcrypt = require('bcryptjs');

const { RoleModel, EmployeeProfileModel, SubsidiaryModel } = require('../../index');
//import Database connection configurations.
const sequelize = require('../../../config/db')
const user = sequelize.define('t_user', {
	Id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	email: { type: Sequelize.STRING, allowNull: false },
	password: { type: Sequelize.STRING, allowNull: false },
	supervisedbyId: { type: Sequelize.INTEGER, allowNull: true },
	allowUserCreation: { type: Sequelize.BOOLEAN, allowNull: true },

	companyId: { type: Sequelize.INTEGER, allowNull: true },

	// subsidiaryIds: { type: Sequelize.INTEGER, allowNull: false },
	subsidiaryId: {
			type: Sequelize.DataTypes.JSON,
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
	employeeIdMapping: { type: Sequelize.INTEGER, allowNull: true },
	employeeName: { type: Sequelize.STRING, allowNull: true },
	deactiveflag: { type: Sequelize.BOOLEAN, allowNull: true, },
	roleId:{ type: Sequelize.INTEGER, allowNull: false },
	isActive: { type: Sequelize.BOOLEAN, allowNull: true ,default:true},
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


user.belongsTo(SubsidiaryModel, {
	foreignKey: 'subsidiaryIds',
	targetKey: 'Id',
		as:"Subsidiary"
  });

user.belongsTo(RoleModel, {
	foreignKey: 'roleId',
	targetKey: 'id',
		as:"role"
  });


  user.belongsTo(RoleModel, {
	foreignKey: 'supervisedbyId',
	targetKey: 'id',
		as:"Supervisedby"
  });

  
  user.belongsTo(EmployeeProfileModel, {
	foreignKey: 'employeeIdMapping',
	targetKey: 'Id',
		as:"EmployeeMapping"
  });


user.isPasswordMatch = (email, password) => user.findOne(
	{

		where: { email: email }
	}).then((data) => {

		return true; //bcrypt.compare(password, data.password);
	});

user.isEmailTakenOldUser = (email, excludeUserId) => user.findOne(
	{
		where: { email: email, id: { [Op.ne]: excludeUserId } }
	}).then((data) => {
		return data;
	});

user.isEmailTakenNewUser = (email) => user.findOne(
	{
		where: { email: email }
	}).then((data) => {
		return data;
	});

user.beforeCreate = (user) => {
	{	// user.password = bcrypt.hash(user.password, 8);
		if (user.password && user.password != "") {
			user.password = user.password && user.password != "" ? bcrypt.hashSync(user.password, 8) : "";
		}
	}
}

module.exports = user