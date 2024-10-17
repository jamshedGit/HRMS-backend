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



const createloan_management_configuration = async (
  req,
  loan_management_configurationBody
) => {
  try {
    loan_management_configurationBody.createdBy = req.user.id;
    console.log(loan_management_configurationBody, "body");

    //check
    const existingConfiguration = await Loan_management_configurationModel.Loan_management_configurationModel.findOne({
      where: { subsidiaryId: loan_management_configurationBody.subsidiaryId },
    });

    if (existingConfiguration) {
   
      let result={"message":'This subsidiary already exists. Save not allowed.',"status":"error"}
        return result;
    }

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





// const updateloan_management_configurationById = async (
//   Id,
//   updateBody,
//   updatedBy
// ) => {
//   const Item = await Loan_management_configurationModel.Loan_management_configurationModel.findOne({
//     where: { Id:Id },
//     include: [
//       {
//         model: Loan_management_detailModel.Loan_management_detailModel,
//         as: "details",
//       },
//     ],
//   });


//   if (!Item) {
//     throw new ApiError(httpStatus.NOT_FOUND, "Record not found");
//   }

//   // Update parent record
//   updateBody.updatedBy = updatedBy;
//   delete updateBody.id;
//   Object.assign(Item, updateBody);
//   await Item.save();

//   // // Update child records if details are provided in the updateBody
//   if (updateBody.details && Array.isArray(updateBody.details)) {
   
    

//     for (const detail of updateBody.details) {
//       console.log("updateBody.details:", detail);
//       if (detail.Id) {
//           // Update existing detail
//           console.log("detail.Id:", detail.Id);
          
//           // Fetch the existing child detail instance
//           const childDetail = await Loan_management_detailModel.Loan_management_detailModel.findOne({
//               where: { Id: detail.Id }
//           });
  
//           if (childDetail) {
//               console.log("Updating childDetail:", childDetail);
//               Object.assign(childDetail, detail); // Apply updates
//               try {
//                   await childDetail.save();
//               } catch (error) {
//                   console.error("Error saving child detail:", error);
//               }
//           } else {
//               console.error("Child detail not found for Id:", detail.Id);
//           }
//       } else {
//           // Create new detail if Id is not present
//           console.log("Creating new detail, no Id present:", detail);
//           detail.loan_management_configurationId = Item.Id; // Associate with the configuration ID
//           await Loan_management_detailModel.Loan_management_detailModel.create(detail);
//       }
//   }
  
//   }

//   return Item;
// };


const updateloan_management_configurationById = async (
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
