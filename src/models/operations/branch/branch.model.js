const Sequelize = require('sequelize');
const { ResourceModel, BranchModel, BankModel } = require('../..');

//import Database connection configurations.
const sequelize = require('../../../config/db')

const branch = sequelize.define('T_Bank_Branch', {
	Id:{
		type:Sequelize.INTEGER,
		autoIncrement:true,
		primaryKey:true
	},
	 Name: { type: Sequelize.STRING, allowNull:true },
	 bankName: { type: Sequelize.STRING, allowNull:true },
	 branchCode: { type: Sequelize.STRING, allowNull:true },
	 countryId: { type: Sequelize.INTEGER, allowNull:true },
	 cityId: { type: Sequelize.INTEGER, allowNull:true },
	 phone: { type: Sequelize.STRING, allowNull:true },
	 fax: { type: Sequelize.STRING, allowNull:true },
	 email: { type: Sequelize.STRING, allowNull:true },
	 contactPerson: { type: Sequelize.STRING, allowNull:true },
	 address: { type: Sequelize.STRING, allowNull:true },
	 accOpeningDate:{ type: Sequelize.DATE, allowNull:true },
	 accNoForSalary: { type: Sequelize.STRING, allowNull:true },
	 accNoForGrad: { type: Sequelize.STRING, allowNull:true },
	 accNoForPF: { type: Sequelize.STRING, allowNull:true },

	 // BankId: { type: Sequelize.INTEGER, allowNull:false },
    isActive: { type: Sequelize.BOOLEAN, allowNull:true, defaultValue: true },
    createdBy:{
		type:Sequelize.INTEGER,
		allowNull:true,
	},
    updatedBy:{
		type:Sequelize.INTEGER,
		allowNull:true,
	},
	createdAt: { type: Sequelize.DATE, allowNull: true },
    updatedAt: { type: Sequelize.DATE, allowNull: true },
	
});

branch.belongsTo(BankModel, {
    as: 'bank',
    foreignKey: 'BankId',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
});



module.exports = branch;