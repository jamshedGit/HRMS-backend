const httpStatus = require("http-status");
const { Gratuity_configurationModel } = require("../../../models/index");
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

const creategratuity_configuration = async (
  req,
  gratuity_configurationBody
) => {
  try {
 
    gratuity_configurationBody.createdBy = req.user.id;

    //check
    const { max_year, min_year } = gratuity_configurationBody;

    // fieldMappings=["subsidiaryId","contract_typeId"]
    const existingConfiguration = await check_range_exist(
      gratuity_configurationBody,
      "Gratuity_configurationModel",
      "min_year",
      "max_year",
      (fieldMappings = ["subsidiaryId", "contract_typeId"])
    );

    if (existingConfiguration) {
    
      let result = {
        message: "Unable to Save: Gratuity Slab overlaps with existing slabs.",
        status: "error",
      };
      return result;
      // let result={"message":'This Already exists. Save not allowed.',"status":"error"}
      // return existingConfiguration;
    }

    // Create the Gratuity configuration
    const gratuity_configurationObj = await Gratuity_configurationModel.create(
      gratuity_configurationBody
    );

    //return data
    const result = await Gratuity_configurationModel.findByPk(
      gratuity_configurationObj.Id,
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
const querygratuity_configuration = async (filter, options, searchQuery) => {
  let limit = options.pageSize;
  let offset = 0 + (options.pageNumber - 1) * limit;

  searchQuery = searchQuery.toLowerCase();
  const queryFilters = [
    {
      min_year: Sequelize.where(
        Sequelize.fn("", Sequelize.col("min_year")),
        "LIKE",
        "%" + searchQuery + "%"
      ),
    },
     { name1: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('Subsidiary.name')), 'LIKE', '%' + searchQuery + '%') },
         { max_year: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col("max_year")), 'LIKE', '%' + searchQuery + '%') },
         { nam3: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('Contract_Type.formName')), 'LIKE', '%' + searchQuery + '%') },
       
      
  ];

  const { count, rows } = await Gratuity_configurationModel.findAndCountAll({
    // order: [["createdAt", "DESC"]],
    order: [
      [Sequelize.col("Subsidiary.name"), "ASC"],   // Order by Subsidiary name
      [Sequelize.col("Contract_Type.formName"), "ASC"],  // Order by Contract Type (formName)
      [Sequelize.col("min_year"), "ASC"],  // Order by Minimum Year
    ],
    where: {
      [Op.or]: queryFilters,
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
        as: "Contract_Type",
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
const getgratuity_configurationById = async (id) => {
  return Gratuity_configurationModel.findOne({
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

const updategratuity_configurationById = async (Id, updateBody, updatedBy) => {
  const Item = await Gratuity_configurationModel.findOne({
    where: { Id: Id },
  });

  if (!Item) {
    throw new ApiError(httpStatus.NOT_FOUND, "Record not found");
  }

  // const existingConfiguration=await update_range_exist (updateBody, "Gratuity_configurationModel","min_year", "max_year", fieldMappings=["subsidiaryId","contract_typeId"])

  const { min_year, max_year } = updateBody;

  if (min_year >= max_year) {
    let result = {
      message: "Min year must be less than To Max year",
      status: "error",
    };
    return result;
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

const deletegratuity_configurationById = async (Id) => {
  const Item = await getgratuity_configurationById(Id, {});

  if (!Item) {
    throw new ApiError(httpStatus.NOT_FOUND, "Item not found");
  }

  await Item.destroy();
  return Item;
};

module.exports = {
  creategratuity_configuration,
  getgratuity_configurationById,
  updategratuity_configurationById,
  deletegratuity_configurationById,
  querygratuity_configuration,
};
