const Sequelize = require('sequelize');
// const { ResourceModel, BranchModel, DeptModel } = require('../..');
const { DataTypes } = require('sequelize');
//import Database connection configurations.
const sequelize = require('../../../config/db');
const { DeptModel } = require('../..');

const department = sequelize.define('t_department', {
    deptId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    deptName: { type: Sequelize.STRING, allowNull: true },
    deptCode: { type: Sequelize.STRING, allowNull: true },
    budgetStrength: { type: Sequelize.STRING, allowNull: true },
    companyId: { type: Sequelize.INTEGER, allowNull: true },
    // subsidiaryId: { type: Sequelize.INTEGER, allowNull: true },
    subsidiaryId: {
		type: DataTypes.JSON,
		allowNull: true,
		set(value) {
			this.setDataValue('subsidiaryId', value.map((v) => Number(v)));
		},


        get() {
            const storedValue = this.getDataValue('subsidiaryId');
            if (storedValue && typeof storedValue === 'string') {
              try {
                const parsedValue = JSON.parse(storedValue);
                // Check if parsedValue is an array before calling .map
                if (Array.isArray(parsedValue)) {
                  return parsedValue.map((v) => String(v));
                }
                return parsedValue; // If it's not an array, return the raw parsed value
              } catch (error) {
          
                return null; // Return null if parsing fails
              }
            }
            return storedValue; // Return storedValue if it's not a string
          }
	},
    parentDept: { type: Sequelize.INTEGER, allowNull: true },
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

},
);

// department.belongsTo(DeptModel, {
//     as: 'dept',
//     foreignKey: 'parentDept',
//     onDelete: 'RESTRICT',
//     onUpdate: 'CASCADE',
// });

// Define associations
// department.belongsTo(DeptModel, { as: 'parentDepartment', foreignKey: 'parentDept' });

// department.hasMany(DeptModel, { as: 'subDepartments', foreignKey: 'parentDeptId' });
// department.belongsTo(DeptModel, { as: 'parentDept', foreignKey: 'parentDept' });


module.exports = department;