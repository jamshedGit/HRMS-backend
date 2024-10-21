const httpStatus = require("http-status");
const { accrue_gratuity_configurationModel } = require("../../../models/index");
const { FormModel } = require("../../../models/index");

const ApiError = require("../../../utils/ApiError");
const Sequelize = require("sequelize");
const { paginationFacts } = require("../../../utils/common");
const { HttpStatusCodes } = require("../../../utils/constants");

const Op = Sequelize.Op;

const createaccrue_gratuity_configuration = async (
  req,
  accrue_gratuity_configurationBody
) => {
  try {
    console.log("createaccrue_gratuity_configuration 1");
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
            model: FormModel,
            attributes: ["formName", "formCode"],
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
    console.error("Error creating gratuity configuration:", error);
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
const queryaccrue_gratuity_configuration = async (
  filter,
  options,
  searchQuery
) => {
  let limit = options.pageSize;
  let offset = 0 + (options.pageNumber - 1) * limit;

  searchQuery = searchQuery.toLowerCase();
  const queryFilters = [
    {
      min_year: Sequelize.where(
        Sequelize.fn("", Sequelize.col("subsidiaryId")),
        "LIKE",
        "%" + searchQuery + "%"
      ),
    },
  ];

  const { count, rows } =
    await accrue_gratuity_configurationModel.findAndCountAll({
      order: [["createdAt", "DESC"]],
      where: {
        [Op.or]: queryFilters,
        // isActive: true
      },
      offset: offset,
      limit: limit,
      include: [
        {
          model: FormModel,
          attributes: ["formName", "formCode"],
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
        model: FormModel,
        attributes: ["formName", "formCode"],
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
      message: "Already Exist.",
      status: "error",
    };
  } else {
    updateBody.updatedBy = updatedBy;
    delete updateBody.id;
    Object.assign(Item, updateBody);
    await Item.save();
    return;
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
