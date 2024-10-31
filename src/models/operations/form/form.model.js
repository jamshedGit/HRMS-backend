const Sequelize = require('sequelize');

//import Database connection configurations.
const sequelize = require('../../../config/db');
const FormConfigModel = require('./form_config.model');

const FormModel = sequelize.define('t_form_menu', {
	Id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	formName: { type: Sequelize.STRING, allowNull: true },
	formCode: { type: Sequelize.STRING, allowNull: true },
	parentFormID: { type: Sequelize.INTEGER, allowNull: true },
	level: { type: Sequelize.INTEGER, allowNull: true },
	subsidiaryId: { type: Sequelize.INTEGER, allowNull: true },
	isDeleted: { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: true },
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

FormConfigModel.hasMany(FormModel, { foreignKey: 'parentFormID' });
FormModel.belongsTo(FormConfigModel, {
    foreignKey: 'parentFormID',
    targetKey: 'Id', 
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
});

//We have implemented this in subsidiary model because it throwing error here.
// SubsidiaryModel.hasMany(FormModel, { foreignKey: 'subsidiaryId' });
// FormModel.belongsTo(SubsidiaryModel, {
//     foreignKey: 'subsidiaryId',
//     targetKey: 'Id', 
//     onDelete: 'RESTRICT',
//     onUpdate: 'RESTRICT',
// });

module.exports = FormModel;