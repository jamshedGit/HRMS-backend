const Sequelize = require('sequelize');
const { ResourceModel } = require('../..');

//import Database connection configurations.
const sequelize = require('../../../config/db')

const Tax_slabModel = sequelize.define('t_tax_slab', {
	Id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},

    from_amount: { type: Sequelize.STRING,allowNull: false },
	to_amount: { type: Sequelize.INTEGER },
	percentage: { type: Sequelize.DECIMAL, allowNull: false },
    fixed_amount: { type: Sequelize.INTEGER, allowNull: false },
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

module.exports = Tax_slabModel;