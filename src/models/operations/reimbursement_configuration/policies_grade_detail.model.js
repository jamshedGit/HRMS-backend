const Sequelize = require("sequelize");
const { Reimbursement_policies_detailModel } = require("../../index");
const { FormModel } = require("../../index");
//import Database connection configurations.
const sequelize = require("../../../config/db");

const Policies_grade_detail = sequelize.define(
  "t_policies_grade_detail",
  {
    Id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    reimbursement_policies_detailId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    salary_gradeId: { type: Sequelize.INTEGER, allowNull: false },
    

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

Policies_grade_detail.belongsTo(Reimbursement_policies_detailModel, {
  foreignKey: "reimbursement_policies_detailId",
  targetKey: "Id", // Optional alias
});

Reimbursement_policies_detailModel.hasMany(Policies_grade_detail, {
  as: "grades",
  foreignKey: "reimbursement_policies_detailId",
});

Policies_grade_detail.belongsTo(FormModel, {
  foreignKey: "salary_gradeId",
  targetKey: "Id",
  as: "salary_grade",
});



module.exports = Policies_grade_detail;
