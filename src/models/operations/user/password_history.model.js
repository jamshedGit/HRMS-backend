const Sequelize = require('sequelize')
const { Op } = require("sequelize");
const bcrypt = require('bcryptjs');

const { RoleModel, EmployeeProfileModel, SubsidiaryModel,User_Model } = require('../../index');
//import Database connection configurations.
const sequelize = require('../../../config/db')
const Password_history = sequelize.define('t_PasswordHistory', {
    Id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: { type: Sequelize.INTEGER, allowNull: false },
    password: { type: Sequelize.STRING, allowNull: false },
    subsidiaryId: { type: Sequelize.INTEGER, allowNull: true },
    companyId: { type: Sequelize.INTEGER, allowNull: true },
    changeDate: { type: Sequelize.DATE, allowNull: true },
    changedById: { type: Sequelize.INTEGER, allowNull: false },

    isActive: { type: Sequelize.BOOLEAN, allowNull: true, default: true },
    createdAt: { type: Sequelize.DATE, allowNull: true },
    updatedAt: { type: Sequelize.DATE, allowNull: true },
});


Password_history.belongsTo(User_Model, {
    foreignKey: 'userId',
    targetKey: 'Id',
    as: "User"
});

Password_history.belongsTo(SubsidiaryModel, {
    foreignKey: 'subsidiaryId',
    targetKey: 'Id',
    as: "Subsidiary"
});


Password_history.belongsTo(User_Model, {
    foreignKey: 'changedById',
    targetKey: 'Id',
    as: "ChangedBy"
});



Password_history.isPasswordMatch = (userId, password) => User_Model.findOne(
    {

        where: { Id: userId }
    }).then((data) => {

        return bcrypt.compare(password, data.password);
 
    });

    Password_history.isPasswordTaken = (userId,password) => Password_history.findOne(
    {
        where: { userId: userId,passwor:password}
    }).then((data) => {
        console.log("userId,password:password",data)
        return data;
    });



    Password_history.beforeCreate = (password) => {
        if (password && password !== "") {
          return bcrypt.hashSync(password, 8); // return the hashed password
        }
        return ""; // return an empty string if no password is provided
      };
      

module.exports = Password_history