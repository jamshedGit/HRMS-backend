const Sequelize = require('sequelize');
const { ResourceModel } = require('../..');

//import Database connection configurations.
const sequelize = require('../../../config/db')

const DonationReceipt = sequelize.define('T_DONATION_TRANSACTION', {
	receiptId:{
		type:Sequelize.INTEGER,
		autoIncrement:true,
		primaryKey:true
	},
	receiptNo: { type: Sequelize.STRING, allowNull:true },
	bookNo: { type: Sequelize.STRING, allowNull:true },
    donorName: { type: Sequelize.STRING, allowNull:true },
    chequeNo: { type: Sequelize.STRING, allowNull:true },
    bankName: { type: Sequelize.STRING, allowNull:true },
    description: { type: Sequelize.STRING, allowNull:true },
    amount: { type: Sequelize.DOUBLE, allowNull:true },
	phoneno: { type: Sequelize.STRING, allowNull:true },
	cityId: { type: Sequelize.INTEGER, allowNull:true },
	centerId: { type: Sequelize.INTEGER, allowNull:true },
	subCenterId: { type: Sequelize.INTEGER, allowNull:true },
	type:{ type: Sequelize.STRING, allowNull:true },
	clerkName: { type: Sequelize.STRING, allowNull:true },

	isActive: { type: Sequelize.BOOLEAN, allowNull:true, defaultValue: true },
    createdBy:{
		type:Sequelize.INTEGER,
		allowNull:true,
	},
    updatedBy:{
		type:Sequelize.INTEGER,
		allowNull:true,
	},
	createdAt: { type: Sequelize.DATE, allowNull: false },
    updatedAt: { type: Sequelize.DATE, allowNull: true },
	
});



module.exports = DonationReceipt;