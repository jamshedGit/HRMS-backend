const Sequelize = require("sequelize");
const { Reimbursement_configurationModel } = require("../../index");
const { FormModel } = require("../../index");
//import Database connection configurations.
const sequelize = require("../../../config/db");

const Reimbursement_accounts_detail = sequelize.define(
  "t_reimbursement_account_detail",
  {
    Id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    reimbursement_configurationId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    reimbursement_typeId: { type: Sequelize.INTEGER, allowNull: false },
    expense_accountId: { type: Sequelize.INTEGER },
    bank_accountId: { type: Sequelize.INTEGER },

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
  }
);

Reimbursement_accounts_detail.belongsTo(Reimbursement_configurationModel, {
  foreignKey: "reimbursement_configurationId",
     onDelete: 'CASCADE'
 
});

Reimbursement_configurationModel.hasMany(Reimbursement_accounts_detail, {
  as: "accounts",
  foreignKey: "reimbursement_configurationId",
});


Reimbursement_accounts_detail.belongsTo(FormModel, {
  foreignKey: "reimbursement_typeId",
  targetKey: "Id",
  as: "Reimbursement_type",
});



Reimbursement_accounts_detail.belongsTo(FormModel, {
    foreignKey: "expense_accountId",
    targetKey: "Id",
    as: "Expense_account",
  });


  
  Reimbursement_accounts_detail.belongsTo(FormModel, {
    foreignKey: "bank_accountId",
    targetKey: "Id",
    as: "Bank_account",
  });
module.exports = Reimbursement_accounts_detail;
