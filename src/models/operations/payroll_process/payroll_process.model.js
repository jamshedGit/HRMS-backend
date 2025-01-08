const Sequelize = require('sequelize');
const { SubsidiaryModel, FormModel, PayrollMonthModel } = require('../..');

const sequelize = require('../../../config/db');


const Payroll_ProcessModel = sequelize.define('t_payroll_process', {
    Id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    payroll_groupId: { type: Sequelize.INTEGER, allowNull: true },
    payroll_monthId: { type: Sequelize.INTEGER, allowNull: false },
    subsidiaryId: { type: Sequelize.INTEGER, allowNull: false },
    companyId: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1 },
    isActive: { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: true },
    completed: { type: Sequelize.INTEGER, allowNull: true, defaultValue: 0 },

    createdBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    updatedBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    createdAt: { type: Sequelize.DATE, allowNull: true },
    completedAt: { type: Sequelize.DATE, allowNull: true },
    updatedAt: { type: Sequelize.DATE, allowNull: true, defaultValue: null },


}, {
    timestamps: false  // Disable automatic timestamps
  });

Payroll_ProcessModel.belongsTo(SubsidiaryModel, {
    foreignKey: 'subsidiaryId',
    targetKey: 'Id',
    as: "Subsidiary"
});

Payroll_ProcessModel.belongsTo(FormModel, {
    foreignKey: 'payroll_groupId',
    targetKey: 'Id',
    as: "PayrollGroup"
});


Payroll_ProcessModel.belongsTo(PayrollMonthModel, {
    foreignKey: 'payroll_monthId',
    targetKey: 'Id',
    as: "PayrollMonth"
});

module.exports = Payroll_ProcessModel;