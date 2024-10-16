const httpStatus = require("http-status");
const Loan_management_configurationModel = require("../../../models/index");
const Loan_management_detailModel = require("../../../models/index");
const FormModel = require("../../../models/index");
const RoleModel = require("../../../models/index");
const ApiError = require("../../../utils/ApiError");
const Sequelize = require("sequelize");
const { paginationFacts } = require("../../../utils/common");
const { HttpStatusCodes } = require("../../../utils/constants");

const Op = Sequelize.Op;
/**
 * Create a Item
 * @param {Object} loan_management_configurationBody
 * @returns {Promise<loan_management_configuration>}
 */

// const createloan_management_configuration = async (req, loan_management_configurationBody) => {
//     console.log("loan_management_configuration Body", loan_management_configurationBody)
//   // loan_management_configurationBody.slug = loan_management_configurationBody.name.replace(/ /g, "-").toLowerCase();
//   console.log(req.user.id);
//   loan_management_configurationBody.createdBy = req.user.id;
//   console.log(loan_management_configurationBody,"body");
//   const addedloan_management_configurationObj = await Loan_management_configurationModel.Loan_management_configurationModel.create(loan_management_configurationBody);
//   //authSMSSend(addedloan_management_configurationObj.dataValues);  // Quick send message at the time of donation
//   return addedloan_management_configurationObj;
// };

// const createloan_management_configuration = async (req, loanManagementConfigurationBody) => {
//   try {
//     loanManagementConfigurationBody.createdBy = req.user.id;
//     console.log(loanManagementConfigurationBody, "body");

//     // Create the loan management configuration
//     // const addedLoanManagementConfigurationObj = await Loan_management_configurationModel.Loan_management_configurationModel.create(loanManagementConfigurationBody);

//     const loanDetails = loanManagementConfigurationBody.details.map(detail => ({
//       ...detail,
//       loan_management_configurationId: 1 // Associate with the configuration ID
//     }));

//     for (const detail of loanDetails) {
//       await Loan_management_detailModel.Loan_management_detailModel.create(detail);
//     }

//     return loanDetails; // Return the created configuration
//   } catch (error) {
//     console.error("Error creating loan management configuration:", error);
//     throw error; // Propagate the error for further handling
//   }
// };

const createloan_management_configuration = async (
  req,
  loan_management_configurationBody
) => {
  try {
    loan_management_configurationBody.createdBy = req.user.id;
    console.log(loan_management_configurationBody, "body");

    // Create the loan management configuration
    const addedloan_management_configurationObj =
      await Loan_management_configurationModel.Loan_management_configurationModel.create(
        loan_management_configurationBody
      );

    console.log(
      "addedloan_management_configurationObj Body",
      loan_management_configurationBody
    );
    // Check for details and save them
    if (
      addedloan_management_configurationObj &&
      addedloan_management_configurationObj.Id &&
      loan_management_configurationBody.details &&
      Array.isArray(loan_management_configurationBody.details)
    ) {
      const loanDetails = loan_management_configurationBody.details.map(
        (detail) => ({
          ...detail,
          loan_management_configurationId:
            addedloan_management_configurationObj.Id, // Associate with the configuration ID
        })
      );

      for (const detail of loanDetails) {
        await Loan_management_detailModel.Loan_management_detailModel.create(
          detail
        );
      }
    }

    // return addedloan_management_configurationObj;

    const populatedConfiguration = await Loan_management_configurationModel.Loan_management_configurationModel.findOne({
      where: { Id: addedloan_management_configurationObj.Id },
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

    return populatedConfiguration;
  } catch (error) {
    console.error("Error creating loan management configuration:", error);
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
const queryloan_management_configuration = async (
  filter,
  options,
  searchQuery
) => {
  let limit = options.pageSize;
  let offset = 0 + (options.pageNumber - 1) * limit;

  searchQuery = searchQuery.toLowerCase();
  const queryFilters = [
    {
      emp_loan_account: Sequelize.where(
        Sequelize.fn("", Sequelize.col("emp_loan_account")),
        "LIKE",
        "%" + searchQuery + "%"
      ),
    },
  ];

  const { count, rows } =
    await Loan_management_configurationModel.Loan_management_configurationModel.findAndCountAll(
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
            model: Loan_management_detailModel.Loan_management_detailModel,
            as: "details",
            include: [
              {
                model: FormModel.FormModel,
                attributes: ["formName", "formCode"],
                as: "Loan_Type",
             
              },
            ]
         
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
      }
    );

  return paginationFacts(count, limit, options.pageNumber, rows);
};


/**
 * Get Item by id
 * @param {ObjectId} id
 * @returns {Promise<ReceiptModel>}
 */
const getloan_management_configurationById = async (id) => {
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



const updateloan_management_configurationById = async (
  Id,
  updateBody,
  updatedBy
) => {
  const Item = await getloan_management_configurationById(Id, {
    include: [
      {
        model: Loan_management_detailModel.Loan_management_detailModel,
        as: "details",
      },
    ],
  });

  console.log("updateloan_management_configurationById Item",updateBody)

  if (!Item) {
    throw new ApiError(httpStatus.NOT_FOUND, "Record not found");
  }

  // Update parent record
  updateBody.updatedBy = updatedBy;
  delete updateBody.id;
  Object.assign(Item, updateBody);
  await Item.save();

  // // Update child records if details are provided in the updateBody
  if (updateBody.details && Array.isArray(updateBody.details)) {
   
    for (const detail of updateBody.details) {
      console.log("updateBody.details %&&",detail)
      if (detail.Id) {
        // Update existing detail
        console.log("detail.id",detail.Id)
        const childDetail = Item.details.find(d => d.Id === detail.Id);
        if (childDetail) {
          console.log("childDetail if id is  present",childDetail)
          // Object.assign(childDetail, detail);
          await childDetail.save();
        }
      } else {
        // Create new detail if id is not present
        console.log("reate new detail if id is not present",detail.Id)
        detail.loan_management_configurationId = Item.Id; // Associate with the configuration ID
        await Loan_management_detailModel.Loan_management_detailModel.create(detail);
      }
    }
  }

  return Item;
};



// const updateloan_management_configurationById = async (
//   Id,
//   updateBody,
//   updatedBy
// ) => {
//   const Item = await getloan_management_configurationById(Id);
//   if (!Item) {
//     throw new ApiError(httpStatus.NOT_FOUND, "record not found");
//   }
//   //console.log("Update Receipt Id" , item);
//   // updateBody.slug = updateBody.name.replace(/ /g, "-").toLowerCase()
//   updateBody.updatedBy = updatedBy;
//   delete updateBody.id;
//   Object.assign(Item, updateBody);
//   await Item.save();
//   return;
// };

/**
 * Delete Item by id
 * @param {ObjectId} Id
 * @returns {Promise<ReceiptModel>}
 */


const deleteloan_management_configurationById = async (Id) => {
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

// const deleteloan_management_configurationById = async (Id) => {
//   const Item = await getloan_management_configurationById(Id);
//   if (!Item) {
//     throw new ApiError(httpStatus.NOT_FOUND, "Item not found");
//   }
//   await Item.destroy();
//   return Item;
// };

module.exports = {
  createloan_management_configuration,
  queryloan_management_configuration,
  getloan_management_configurationById,
  updateloan_management_configurationById,
  deleteloan_management_configurationById,
};
