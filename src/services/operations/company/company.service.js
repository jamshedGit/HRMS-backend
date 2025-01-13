const httpStatus = require("http-status");
const { CompanyModel, SubsidiaryModel } = require("../../../models/index");
const { FormModel } = require("../../../models/index");

const ApiError = require("../../../utils/ApiError");
const Sequelize = require("sequelize");
const { paginationFacts } = require("../../../utils/common");
const { HttpStatusCodes } = require("../../../utils/constants");

const Op = Sequelize.Op;


/**
 * Query for Items
 * @param {Object} filter -  Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const querycompany = async (
  filter,
  options,
  searchQuery
) => {
  let limit = options.pageSize;
  let offset = 0 + (options.pageNumber - 1) * limit;

  searchQuery = searchQuery.toLowerCase();
  const queryFilters = [

     { name1: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('companyLegalName')), 'LIKE', '%' + searchQuery + '%') },
   
    ];

  const { count, rows } =
    await CompanyModel.findAndCountAll({
      order: [
        ["companyLegalName", "ASC"],   // Use the alias and attribute name
      ],
      where: {
        [Op.or]: queryFilters,
        // isActive: true
      },
      offset: offset,
      limit: limit,
   
    });

  return paginationFacts(count, limit, options.pageNumber, rows);
};

/**
 * Get Item by id
 * @param {ObjectId} id
 * @returns {Promise<ReceiptModel>}
 */
const getcompanyById = async (id) => {
  return CompanyModel.findOne({
    where: { Id: id },
    include: [
      {
        model: SubsidiaryModel,
        attributes: ["name"],
        as: "Subsidiary",
      },
      {
        model: FormModel,
        attributes: ["formName", "formCode"],
        as: "GraduityExpenseAccount",
      },
      {
        model: FormModel,
        attributes: ["formName", "formCode"],
        as: "GraduityPayableAccount",
      },
      {
        model: FormModel,
        attributes: ["formName", "formCode"],
        as: "BankCashAccount",
      },
    ],
  });
};

/**
 * Update Item by id
 * @param {ObjectId} ReceiptId
 * @param {Object} updateBody
 * @returns {Promise<ReceiptModel>}
 */



module.exports = {
  getcompanyById,
  querycompany,
};
