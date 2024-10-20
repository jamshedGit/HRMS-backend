const httpStatus = require("http-status");
const {Gratuity_configurationModel}= require("../../../models/index");
const {FormModel} = require("../../../models/index");

const ApiError = require("../../../utils/ApiError");
const Sequelize = require("sequelize");
const { paginationFacts } = require("../../../utils/common");
const { HttpStatusCodes } = require("../../../utils/constants");

const Op = Sequelize.Op;

const creategratuity_configuration = async (
  req,
  gratuity_configurationBody
) => {
  try {
    console.log("body gratuity_configurationBody",gratuity_configurationBody)
    gratuity_configurationBody.createdBy = req.user.id;


    //check
    const { max_year, min_year } = gratuity_configurationBody;

    // Validate min is less than max
    if (max_year < min_year) {
        let result={"message":'Min year must be less than To Max.',"status":"error"}
        return result;   
    }

    const existingConfiguration = await Gratuity_configurationModel.findOne({
        where: {
          subsidiaryId: gratuity_configurationBody.subsidiaryId,
          contract_typeId: gratuity_configurationBody.contract_typeId,
            [Op.or]: [
                { min_year: { [Op.between]: [min_year, max_year] } },
                { max_year: { [Op.between]: [min_year, max_year] } },
                { min_year: { [Op.lte]: min_year }, max_year: { [Op.gte]: max_year } }
            ]
        }
    });

    if (existingConfiguration) {
   
      let result={"message":'This Already exists. Save not allowed.',"status":"error"}
        return result;
    }
   
    

    // Create the Gratuity configuration
    const gratuity_configurationObj =
      await Gratuity_configurationModel.create( gratuity_configurationBody);

      //return data
      const result = await Gratuity_configurationModel.findByPk(gratuity_configurationObj.Id, {
        include: [
            {
                model: FormModel,
                attributes: ["formName", "formCode"],
                as: "Subsidiary",
            },
            {
                model: FormModel,
                attributes: ["formName", "formCode"],
                as: "Contract_Type",
            },
            {
                model: FormModel,
                attributes: ["formName", "formCode"],
                as: "Basis_Of_Gratuity",
            }
        ]
    });
console.log("result",result)
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
const querygratuity_configuration = async (
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
        Sequelize.fn("", Sequelize.col("min_year")),
        "LIKE",
        "%" + searchQuery + "%"
      ),
    },
  ];

  const { count, rows } =
    await Gratuity_configurationModel.findAndCountAll(
      {
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
            as: "Contract_Type",
          },
       

          { 
            model: FormModel,
            attributes: ["formName", "formCode"],
            as:"Basis_Of_Gratuity"
          
          },
        ],
      }
    );

  return paginationFacts(count, limit, options.pageNumber, rows);
};


/**
 * Get Item by id
 * @param {ObjectId} id
 * @returns {Promise<ReceiptModel>}
 */
const getgratuity_configurationById = async (id) => {
  return Loan_management_configurationModel.Loan_management_configurationModel.findOne({
    where: { Id:id },
    include: [
      {
        model: Loan_management_detailModel.Loan_management_detailModel,
        as: "details",
        include: [
          {
            model: FormModel.FormModel,
            attributes: ["formName", "formCode"],
            as: "Loan_Type",
          },
        ],
      },
      {
        model: FormModel.FormModel,
        attributes: ["formName", "formCode"],
        as: "Subsidiary",
      },
      {
        model: FormModel.FormModel,
        attributes: ["formName", "formCode"],
        as: "Account",
      },
      {
        model: RoleModel.RoleModel,
        attributes: ["name"],
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







const updategratuity_configurationById = async (
  Id,
  updateBody,
  updatedBy
) => {

  const { subsidiaryId} = updateBody;


  const overlappingSubsidiary = await Loan_management_configurationModel.Loan_management_configurationModel.findOne({
    where: {
        Id: { [Op.ne]: Id },
      [Op.or]: [
        { subsidiaryId:subsidiaryId },
       
      ]
    }
  });
  if (overlappingSubsidiary) {

let result={"message":'New subsidiary overlaps with existing subsidiary.',"status":"error"}
return result;
}
  const Item = await Loan_management_configurationModel.Loan_management_configurationModel.findOne({
    where: { Id: Id },
    include: [
      {
        model: Loan_management_detailModel.Loan_management_detailModel,
        as: "details",
      },
    ],
  });
  console.log("Item for update updateBody",updateBody)

  if (!Item) {
    throw new ApiError(httpStatus.NOT_FOUND, "Record not found");
  }

  // Update parent record
  // updateBody.updatedBy = updatedBy;
  // delete updateBody.id;
  // Object.assign(Item, updateBody);
  // await Item.save();

  const existingDetailIds = Item.details.map(d => d.Id);
  console.log("existingDetailIds,Item.details.map(d => d.Id)",existingDetailIds)
  // Update or create child records
  if (updateBody.details && Array.isArray(updateBody.details)) {
    const newDetailIds = [];

    for (const detail of updateBody.details) {
      console.log("updateBody.details:", detail);
      if (detail.Id) {
        // Update existing detail
        console.log("detail.Id:", detail.Id);
        const childDetail = await Loan_management_detailModel.Loan_management_detailModel.findOne({
          where: { Id: detail.Id }
        });

        if (childDetail) {
          console.log("Updating childDetail:", childDetail);
          Object.assign(childDetail, detail); // Apply updates
          try {
            await childDetail.save();
          } catch (error) {
            console.error("Error saving child detail:", error);
          }
        } else {
          console.error("Child detail not found for Id:", detail.Id);
        }
        newDetailIds.push(detail.Id);
      } else {
        // Create new detail if Id is not present
        console.log("Creating new detail, no Id present:", detail);
        detail.loan_management_configurationId = Item.Id; // Associate with the configuration ID
        await Loan_management_detailModel.Loan_management_detailModel.create(detail);
        newDetailIds.push(detail.Id); // Add the new detail's Id
      }
    }

    // Delete child records that are not present in the incoming details
    for (const existingId of existingDetailIds) {
      console.log("existingDetailIds,existingId",existingDetailIds,existingId)
      if (!newDetailIds.includes(existingId)) {
        console.log("Deleting child detail with Id:", existingId);
        await Loan_management_detailModel.Loan_management_detailModel.destroy({
          where: { Id: existingId }
        });
      }
    }
  }
    // Update parent record
  updateBody.updatedBy = updatedBy;
  delete updateBody.id;
  Object.assign(Item, updateBody);
  await Item.save();

  return Item;
};


/**
 * Delete Item by id
 * @param {ObjectId} Id
 * @returns {Promise<ReceiptModel>}
 */


const deletegratuity_configurationById = async (Id) => {
  const Item = await getloan_management_configurationById(Id, {
    include: [
      {
        model: Loan_management_detailModel.Loan_management_detailModel,
        as: "details", // Make sure this matches the alias used in your associations
      },
    ],
  });

  if (!Item) {
    throw new ApiError(httpStatus.NOT_FOUND, "Item not found");
  }

  // Delete child records
  if (Item.details && Array.isArray(Item.details)) {
    for (const detail of Item.details) {
      await detail.destroy(); // Remove each detail record
    }
  }

  // Now delete the parent record
  await Item.destroy();
  return Item;
};



module.exports = {
    creategratuity_configuration,
    getgratuity_configurationById,
    updategratuity_configurationById,
    deletegratuity_configurationById,
    querygratuity_configuration
}
