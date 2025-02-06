const Sequelize = require('sequelize');
const { SubsidiaryModel, FormModel, PayrollMonthModel } = require('../..');

const sequelize = require('../../../config/db');


const Payroll_Stop_LoanModel = sequelize.define('t_payroll_stop_loan', {
    Id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    employeeId: { type: Sequelize.INTEGER, allowNull: false },
    payroll_groupId: { type: Sequelize.INTEGER, allowNull: true },
    payroll_monthId: { type: Sequelize.INTEGER, allowNull: false },
    subsidiaryId: { type: Sequelize.INTEGER, allowNull: false },
    companyId: { type: Sequelize.INTEGER, allowNull: false},
     loan_typeId: { type: Sequelize.INTEGER, allowNull: false },
     loan_request_detailId: { type: Sequelize.INTEGER, allowNull: false },
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
    updatedAt: { type: Sequelize.DATE, allowNull: true, defaultValue: null },


}, {
    timestamps: false  // Disable automatic timestamps
  });

  Payroll_Stop_LoanModel.belongsTo(SubsidiaryModel, {
    foreignKey: 'subsidiaryId',
    targetKey: 'Id',
    as: "Subsidiary"
});

Payroll_Stop_LoanModel.belongsTo(FormModel, {
    foreignKey: 'payroll_groupId',
    targetKey: 'Id',
    as: "PayrollGroup"
});


Payroll_Stop_LoanModel.belongsTo(PayrollMonthModel, {
    foreignKey: 'payroll_monthId',
    targetKey: 'Id',
    as: "PayrollMonth"
});

module.exports = Payroll_Stop_LoanModel;