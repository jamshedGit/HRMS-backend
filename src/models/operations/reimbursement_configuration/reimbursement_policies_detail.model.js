const Sequelize = require("sequelize");
const { ResourceModel } = require("../..");
const { Reimbursement_configurationModel } = require("../../index");
const { FormModel } = require("../../index");
//import Database connection configurations.
const sequelize = require("../../../config/db");

const Reimbursement_policies_detail = sequelize.define(
  "t_reimbursement_policies_detail",
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
    max_amount: { type: Sequelize.INTEGER, allowNull: false },
    attachment_required: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },

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

Reimbursement_policies_detail.belongsTo(Reimbursement_configurationModel, {
  foreignKey: "reimbursement_configurationId",
  targetKey: "Id", // Optional alias
});

Reimbursement_configurationModel.hasMany(Reimbursement_policies_detail, {
  as: "policies",
  foreignKey: "reimbursement_configurationId",
});

Reimbursement_policies_detail.belongsTo(FormModel, {
  foreignKey: "reimbursement_typeId",
  targetKey: "Id",
  as: "reimbursement_type",
});

Reimbursement_policies_detail.belongsTo(FormModel, {
  foreignKey: "reimbursement_typeId",
  targetKey: "Id",
  as: "reimbursement_type",
});

module.exports = Reimbursement_policies_detail;
