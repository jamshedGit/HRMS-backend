const httpStatus = require("http-status");
const { accrue_gratuity_configurationModel, SubsidiaryModel } = require("../../../models/index");
const { FormModel } = require("../../../models/index");

const ApiError = require("../../../utils/ApiError");
const Sequelize = require("sequelize");
const { paginationFacts, currentSubsidiaryPermission } = require("../../../utils/common");
const { HttpStatusCodes } = require("../../../utils/constants");

const Op = Sequelize.Op;

const createaccrue_gratuity_configuration = async (
  req,
  accrue_gratuity_configurationBody
) => {
  try {
 
    const subsidiaryExists = await accrue_gratuity_configurationModel.findOne({
      where: { subsidiaryId: accrue_gratuity_configurationBody.subsidiaryId },
    });

    if (subsidiaryExists) {
      return {
        message: "Already Exist",
        status: "error",
      };
    }

    accrue_gratuity_configurationBody.createdBy = req.user.id;
    const addedaccrue_gratuity_configurationObj =
      await accrue_gratuity_configurationModel.create(
        accrue_gratuity_configurationBody
      );

    const result = await accrue_gratuity_configurationModel.findByPk(
      addedaccrue_gratuity_configurationObj.Id,
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
      }
    );

    return result;
  } catch (error) {
  
    throw error; // Rethrow or handle the error as needed
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
const queryaccrue_gratuity_configuration = async (req,
  filter,
  options,
  searchQuery
) => {
  let limit = options.pageSize;
  let offset = 0 + (options.pageNumber - 1) * limit;

  searchQuery = searchQuery.toLowerCase();
  const queryFilters = [
    // {
    //   subsidiaryId: Sequelize.where(
    //     Sequelize.fn("", Sequelize.col("t_subsidiary.name")),
    //     // Sequelize.fn('LOWER', Sequelize.col('accrue_gratuity_configuration.subsidiaryId')), // Correct reference to subsidiaryId
    //     "LIKE",
    //     "%" + searchQuery + "%"
    //   ),
    // },
     { name1: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('Subsidiary.name')), 'LIKE', '%' + searchQuery + '%') },
     { nam2: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('GraduityExpenseAccount.formName')), 'LIKE', '%' + searchQuery + '%') },
     { nam3: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('GraduityPayableAccount.formName')), 'LIKE', '%' + searchQuery + '%') },
     { name4: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('BankCashAccount.formName')), 'LIKE', '%' + searchQuery + '%') },
  
    ];

  const { count, rows } =
    await accrue_gratuity_configurationModel.findAndCountAll({
      order: [
        ["Subsidiary", "name", "ASC"],   // Use the alias and attribute name
      ],
      where: {
        [Op.or]: queryFilters,
        subsidiaryId: {
          [Op.in]: await currentSubsidiaryPermission(req)  // Filter banks based on subsidiaryId
        }
        // isActive: true
      },
      offset: offset,
      limit: limit,
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

    




  return paginationFacts(count, limit, options.pageNumber, rows);
};

/**
 * Get Item by id
 * @param {ObjectId} id
 * @returns {Promise<ReceiptModel>}
 */
const getaccrue_gratuity_configurationById = async (id) => {
  return accrue_gratuity_configurationModel.findOne({
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

const updateaccrue_gratuity_configurationById = async (
  Id,
  updateBody,
  updatedBy
) => {
  const Item = await getaccrue_gratuity_configurationById(Id);
  if (!Item) {
    throw new ApiError(httpStatus.NOT_FOUND, "record not found");
  }

  const exist = await accrue_gratuity_configurationModel.findOne({
    where: {
      id: { [Op.ne]: Id },
      subsidiaryId: updateBody.subsidiaryId,
    },
  });
  if (exist) {
    return {
      message: "Record already exists.",
      status: "error",
    };
  } else {
    updateBody.updatedBy = updatedBy;
    delete updateBody.id;
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

const deleteaccrue_gratuity_configurationById = async (Id) => {
  const Item = await getaccrue_gratuity_configurationById(Id, {});

  if (!Item) {
    throw new ApiError(httpStatus.NOT_FOUND, "Item not found");
  }

  await Item.destroy();
  return Item;
};

module.exports = {
  createaccrue_gratuity_configuration,
  getaccrue_gratuity_configurationById,
  updateaccrue_gratuity_configurationById,
  deleteaccrue_gratuity_configurationById,
  queryaccrue_gratuity_configuration,
};
