const Sequelize = require('sequelize');
const { ResourceModel } = require('../../..');

//import Database connection configurations.
const sequelize = require('../../../config/db')

const EmpSalaryModel = sequelize.define('t_employee_salary_benefits', {
    Id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    employeeId: { type: Sequelize.INTEGER, allowNull: true },
    currencyId: { type: Sequelize.INTEGER, allowNull: true },
    grossSalary: { type: Sequelize.INTEGER, allowNull: true },
    basicSalary: { type: Sequelize.INTEGER, allowNull: true },
    gratuity_member: { type: Sequelize.BOOLEAN, allowNull: true },
    gratuity_startDate: { type: Sequelize.DATE, allowNull: true },
    overtime_allowance: { type: Sequelize.BOOLEAN, allowNull: true },
    overtime_working_day: { type: Sequelize.FLOAT, allowNull: true },
    overtime_off_day: { type: Sequelize.FLOAT, allowNull: true },
    overtime_holiday: { type: Sequelize.FLOAT, allowNull: true },
    shift_allowance: { type: Sequelize.BOOLEAN, allowNull: true },
    regularity_allowance: { type: Sequelize.BOOLEAN, allowNull: true },
    punctuality_allowance: { type: Sequelize.BOOLEAN, allowNull: true },
    pf_member: { type: Sequelize.BOOLEAN, allowNull: true },
    pf_reg_date: { type: Sequelize.DATE, allowNull: true },
    pf_accNo: { type: Sequelize.STRING, allowNull: true },
    eobi_member: { type: Sequelize.BOOLEAN, allowNull: true },
    eobi_reg_date: { type: Sequelize.DATE, allowNull: true },
    eobi_accNo: { type: Sequelize.STRING, allowNull: true },
    social_security_member: { type: Sequelize.BOOLEAN, allowNull: true },
    social_security_reg_date: { type: Sequelize.DATE, allowNull: true },
    social_security_accNo: { type: Sequelize.STRING, allowNull: true },
    pension_member: { type: Sequelize.BOOLEAN, allowNull: true },
    pension_reg_date: { type: Sequelize.DATE, allowNull: true },
    pension_accNo: { type: Sequelize.STRING, allowNull: true },
    profit_member: { type: Sequelize.BOOLEAN, allowNull: true },
    emp_bankId: { type: Sequelize.INTEGER, allowNull: true },
    emp_bank_branchId: { type: Sequelize.INTEGER, allowNull: true },
    emp_bank_accountTitle: { type: Sequelize.STRING, allowNull: true },
    emp_bank_accNo: { type: Sequelize.STRING, allowNull: true },
    payment_mode_Id: { type: Sequelize.INTEGER, allowNull: true },
    company_bankId: { type: Sequelize.INTEGER, allowNull: true },
    company_branchId: { type: Sequelize.INTEGER, allowNull: true },
    company_from_accNo: { type: Sequelize.STRING, allowNull: true },
    approved: {type: Sequelize.BOOLEAN, allowNull: true, defaultValue: false},
    grossPackage: {type: Sequelize.INTEGER, allowNull: true, defaultValue: 0},
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

module.exports = EmpSalaryModel;