const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../../config/db');
const { LeaveTypeSalaryDeductionPoliciesModel, LeaveTypePoliciesModel, EmployeeProfileModel, FormModel } = require('../..');

// Define the User model
class LeaveManagementConfigurationModel extends Model {
  // static associate(models) {
  //   // define associations here
  //   this.hasMany(LeaveTypePoliciesModel, {
  //     foreignKey: 'Id'
  //   })

  //   this.hasMany(LeaveTypeSalaryDeductionPoliciesModel, {
  //     foreignKey: 'Id'
  //   })

  //   // Association with EmployeeProfileModel model (subsidiaryId is a foreign key)
  //   this.belongsTo(EmployeeProfileModel, {
  //     foreignKey: 'subsidiaryId',
  //     targetKey: 'Id',  // Assuming 'Id' is the primary key in LeaveType table
  //   });

  //   // Association with FormModel model (subsidiaryId is a foreign key)
  //   this.belongsTo(FormModel, {
  //     foreignKey: 'employeeTypeId',
  //     targetKey: 'Id',  // Assuming 'Id' is the primary key in LeaveType table
  //   });

  //   // Association with FormModel model (subsidiaryId is a foreign key)
  //   this.belongsTo(FormModel, {
  //     foreignKey: 'gradeId',
  //     targetKey: 'Id',  // Assuming 'Id' is the primary key in LeaveType table
  //   });
  // }
}

// Initialize the model
LeaveManagementConfigurationModel.init(
  {
    Id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    subsidiaryId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    employeeTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    gradeId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    weekend: {
      type: DataTypes.JSON,
      allowNull: true
    },
    isSandwich: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    isActive: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    updatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 't_leave_management_configuration',
  }
);





// Association with EmployeeProfileModel model (subsidiaryId is a foreign key)
LeaveManagementConfigurationModel.belongsTo(EmployeeProfileModel, {
  foreignKey: 'subsidiaryId',
  targetKey: 'Id',  // Assuming 'Id' is the primary key in LeaveType table
});

// Association with FormModel model (subsidiaryId is a foreign key)
LeaveManagementConfigurationModel.belongsTo(FormModel, {
  foreignKey: 'employeeTypeId',
  targetKey: 'Id',  // Assuming 'Id' is the primary key in LeaveType table
});

// Association with FormModel model (subsidiaryId is a foreign key)
LeaveManagementConfigurationModel.belongsTo(FormModel, {
  foreignKey: 'gradeId',
  targetKey: 'Id',  // Assuming 'Id' is the primary key in LeaveType table
});


module.exports = LeaveManagementConfigurationModel;
