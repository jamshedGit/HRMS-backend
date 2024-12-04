const httpStatus = require("http-status");
const {EmployeeProfileModel} = require("../../../models/index");
const { FormModel,SubsidiaryModel } = require("../../../models/index");

const ApiError = require("../../../utils/ApiError");
const Sequelize = require("sequelize");
const {
  paginationFacts,
  check_range_exist,
  // update_range_exist,
} = require("../../../utils/common");
const { HttpStatusCodes } = require("../../../utils/constants");

const Op = Sequelize.Op;

const createemployee_profile = async (
  req,
  employee_profileBody
) => {
  try {
 
    employee_profileBody.createdBy = req.user.id;


 
    // Create the Gratuity configuration
    const employee_profileObj = await Gratuity_configurationModel.create(
      employee_profileBody
    );

    //return data
    const result = await Gratuity_configurationModel.findByPk(
      employee_profileObj.Id,
      {
        include: [
          {
            model: SubsidiaryModel,
            attributes: ["name"],
            as: "Subsidiary",
          },
          {
            model: FormModel,
            attributes: ["formName", "formCode"],
            as: "Contract_Type",
          },
        ],
      }
    );

    return result;
  } catch (error) {
  throw error
  }
};

/**
 * Query for Items
 * @param {Object} filter -  Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */


const queryemployee_profile = async (
  filter,
  options,
  searchQuery
) => {
 
  let limit = options.pageSize;
  let offset = 0 + (options.pageNumber - 1) * limit;
  searchQuery = searchQuery.toLowerCase();
  const queryFilters = [
    // { isActive: sequelize.where }
    // { Id: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('Id')), 'LIKE', '%' + searchQuery + '%') },
    { firstName: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('firstName')), 'LIKE', '%' + searchQuery + '%') },
    { lastName: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('lastName')), 'LIKE', '%' + searchQuery + '%') },

  ]

  const { count, rows } = await EmployeeProfileModel.findAndCountAll({
    order: [
      ['createdAt', 'DESC']
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
const getemployee_profileById = async (id) => {
  return Emp_profileModel.findOne({
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
        as: "Contract_Type",
      },
    ],
  });

  // return populatedConfiguration;

  // return Loan_management_configurationModel.Loan_management_configurationModel.findByPk(
  //   id
  // );
};

/**
 * Update Item by id
 * @param {ObjectId} ReceiptId
 * @param {Object} updateBody
 * @returns {Promise<ReceiptModel>}
 */

const updateemployee_profileById = async (Id, updateBody, updatedBy) => {
  const Item = await Gratuity_configurationModel.findOne({
    where: { Id: Id },
  });

  if (!Item) {
    throw new ApiError(httpStatus.NOT_FOUND, "Record not found");
  }

  const existingConfiguration = await Gratuity_configurationModel.findOne({
    where: {
      [Op.and]: [
        { subsidiaryId: updateBody.subsidiaryId },
        { contract_typeId: updateBody.contract_typeId },
        { id: { [Op.ne]: updateBody.Id } },
        {
          [Op.or]: [
            { min_year: { [Op.between]: [min_year, max_year] } },
            { max_year: { [Op.between]: [min_year, max_year] } },
            {
              min_year: { [Op.lte]: min_year },
              max_year: { [Op.gte]: max_year },
            },
          ],
        },
      ],
    },
  });

  if (existingConfiguration) {
   
    let result = {
      message: "Unable to Save: Gratuity Slab overlaps with existing slabs.",
      status: "error",
    };
    return result;
  } else {
   
    updateBody.updatedBy = updatedBy;
    delete updateBody.id; // Optionally keep this if your model has a primary key

    Object.assign(Item, updateBody);
    await Item.save();
    return Item;
  }
};

/**
 * Delete Item by id
 * @param {ObjectId} Id
 * @returns {Promise<ReceiptModel>}
 */

const deleteemployee_profileById = async (Id) => {
  const Item = await getemployee_profileById(Id, {});

  if (!Item) {
    throw new ApiError(httpStatus.NOT_FOUND, "Item not found");
  }

  await Item.destroy();
  return Item;
};

module.exports = {
  createemployee_profile,
  getemployee_profileById,
  updateemployee_profileById,
  deleteemployee_profileById,
  queryemployee_profile
};
