const httpStatus = require("http-status");
const { Reimbursement_configurationModel,Reimbursement_policies_detailModel,Policies_grade_detailModel,Reimbursement_accounts_detailModel } = require("../../../models/index");
const { FormModel } = require("../../../models/index");

const ApiError = require("../../../utils/ApiError");
const Sequelize = require("sequelize");
const { paginationFacts } = require("../../../utils/common");
const { HttpStatusCodes } = require("../../../utils/constants");

const Op = Sequelize.Op;


const createreimbursement_configuration = async (req, reimbursement_configurationBody) => {
  try {
    console.log("Creating reimbursement configuration...",reimbursement_configurationBody);

    // Check if the parent configuration already exists
    const subsidiaryExists = await Reimbursement_configurationModel.findOne({
      where: {
        subsidiaryId: reimbursement_configurationBody.subsidiaryId,
        payroll_groupId: reimbursement_configurationBody.payroll_groupId,
      },
    });

    if (subsidiaryExists) {
      return {
        message: "Already Exist",
        status: "error",
      };
    }

    // Set createdBy field
    reimbursement_configurationBody.createdBy = req.user.id;

    // Create the parent reimbursement configuration
    const addedReimbursementConfiguration = await Reimbursement_configurationModel.create(reimbursement_configurationBody);

    // Check if policies exist and create them
    if (addedReimbursementConfiguration && Array.isArray(reimbursement_configurationBody.policies)) {
      console.log("addedReimbursementConfiguration child")
      const createdPolicies = await Reimbursement_policies_detailModel.bulkCreate(
        reimbursement_configurationBody.policies.map(policy => ({
          ...policy,
          reimbursement_configurationId: addedReimbursementConfiguration.Id,
        }))
      );

 


      for (const policy of reimbursement_configurationBody.policies) {
        const createdPolicy = createdPolicies.find(p => p.reimbursement_typeId === policy.reimbursement_typeId);
    
        if (createdPolicy && Array.isArray(policy.grades)) {
          console.log("policy.grades", policy.grades);
          
          // Create grade details, dynamically adding `salary_gradeId` if only IDs are sent
          await Policies_grade_detailModel.bulkCreate(
            policy.grades.map(gradeDetail => {
              // Check if gradeDetail is just an ID (number) and dynamically add the `salary_gradeId`
              if (typeof gradeDetail === 'number') {
                return {
                  salary_gradeId: gradeDetail, // Add `salary_gradeId` when it's missing
                  reimbursement_policies_detailId: createdPolicy.Id,
                };
              }
    
            
              return {
                ...gradeDetail,
                reimbursement_policies_detailId: createdPolicy.Id,
              };
            })
          );
        }
      }



    }


    if (addedReimbursementConfiguration && Array.isArray(reimbursement_configurationBody.accounts)) {
  
      const createdAccounts = await Reimbursement_accounts_detailModel.bulkCreate(
        reimbursement_configurationBody.accounts.map(account => ({
          ...account,
          reimbursement_configurationId: addedReimbursementConfiguration.Id,
        }))
      );


    }

  

    return await getreimbursement_configurationById(addedReimbursementConfiguration.Id );
    // return "Done"

  } catch (error) {
    console.error("Error creating reimbursement configuration:", error);
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
const queryreimbursement_configuration = async (
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

  // const { count, rows } =
    
  //   await Reimbursement_configurationModel.findAndCountAll({
  //     order: [["createdAt", "DESC"]],
  //     where: {
  //       [Op.or]: queryFilters,
  //       // isActive: true
  //     },
  //     offset: offset,
  //     limit: limit,
  //     include: [
  //       {
  //         model: Reimbursement_policies_detailModel,
      
  //         as: "policies",
  //         include: [
  //           {
  //             model: Policies_grade_detailModel, 
  //             attributes: ["formName", "formCode"],
  //             as: "salary_grade", 
  //           },
  //         ],
  //       },
     
    
  //     ],
  //   });


  const { count, rows } = await Reimbursement_configurationModel.findAndCountAll({
    order: [["createdAt", "DESC"]],
    where: {
      [Op.or]: queryFilters,
      // isActive: true
    },
    offset: offset,
    limit: limit,
    include: [
      {
        model: Reimbursement_policies_detailModel,
        as: "policies",
        include: [
          {
            model: Policies_grade_detailModel,
            as: "grades", // Ensure this matches the alias in the child model
            include: [
              {
                model: FormModel, // Include the salary grade model
                attributes: ["formName", "formCode"],
                as: "salary_grade", // Ensure this matches the alias in the grandchild model
              },
            ],
          },
        ],
      },
   
      {
        model: Reimbursement_accounts_detailModel,
        as: "accounts",
        include: [
          {
            model: FormModel,
            attributes: ["formName", "formCode"],
            as: "Reimbursement_type",
          },
          {
            model: FormModel,
            attributes: ["formName", "formCode"],
            as: "Expense_account",
          },
          {
            model: FormModel,
            attributes: ["formName", "formCode"],
            as: "Bank_account",
          },
        ],
      },
      {
        model: FormModel,
        attributes: ["formName", "formCode"],
        as: "Subsidiary",
      },
      {
        model: FormModel,
        attributes: ["formName", "formCode"],
        as: "PayrollGroup",
      },
      {
        model: FormModel,
        attributes: ["formName", "formCode"],
        as: "CycleType",
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


// const getreimbursement_configurationById = async (id) => {
//   console.log("final id",id)
 
// return await Reimbursement_configurationModel.findOne({

//   where: { Id:id },

//   include: [
//     {
//       model: Reimbursement_policies_detailModel,
//       as: "policies",
//       include: [
//         {
//           model: Policies_grade_detailModel,
//           as: "grades", // Ensure this matches the alias in the child model
//           include: [
//             {
//               model: FormModel, // Include the salary grade model
//               attributes: ["formName", "formCode"],
//               as: "salary_grade", // Ensure this matches the alias in the grandchild model
//             },
//           ],
//         },
//       ],
//     },

//     {
//       model: Reimbursement_accounts_detailModel,
//       as: "accounts",
//       include: [
//         {
//           model: FormModel,
//           attributes: ["formName", "formCode"],
//           as: "Reimbursement_type",
//         },
//         {
//           model: FormModel,
//           attributes: ["formName", "formCode"],
//           as: "Expense_account",
//         },
//         {
//           model: FormModel,
//           attributes: ["formName", "formCode"],
//           as: "Bank_account",
//         },
//       ],
//     },


//     {
//       model: FormModel,
//       attributes: ["formName", "formCode"],
//       as: "Subsidiary",
//     },
//     {
//       model: FormModel,
//       attributes: ["formName", "formCode"],
//       as: "PayrollGroup",
//     },
//     {
//       model: FormModel,
//       attributes: ["formName", "formCode"],
//       as: "CycleType",
//     },
//   ],
// });





// };



const getreimbursement_configurationById = async (id) => {
  console.log("final id", id);

  // Fetch the reimbursement configuration
  const result = await Reimbursement_configurationModel.findOne({
    where: { Id: id },
    include: [
      {
        model: Reimbursement_policies_detailModel,
        as: "policies",
        include: [
          {
            model: Policies_grade_detailModel,
            as: "grades", // Ensure this matches the alias in the child model
            include: [
              {
                model: FormModel, // Include the salary grade model
                attributes: ["formName", "formCode"],
                as: "salary_grade", // Ensure this matches the alias in the grandchild model
              },
            ],
          },
        ],
      },
      {
        model: Reimbursement_accounts_detailModel,
        as: "accounts",
        include: [
          {
            model: FormModel,
            attributes: ["formName", "formCode"],
            as: "Reimbursement_type",
          },
          {
            model: FormModel,
            attributes: ["formName", "formCode"],
            as: "Expense_account",
          },
          {
            model: FormModel,
            attributes: ["formName", "formCode"],
            as: "Bank_account",
          },
        ],
      },
      {
        model: FormModel,
        attributes: ["formName", "formCode"],
        as: "Subsidiary",
      },
      {
        model: FormModel,
        attributes: ["formName", "formCode"],
        as: "PayrollGroup",
      },
      {
        model: FormModel,
        attributes: ["formName", "formCode"],
        as: "CycleType",
      },
    ],
  });

  // Transform the result to adjust the grades format
  if (result) {
    const transformedResult = JSON.parse(JSON.stringify(result)); // Convert Sequelize instance to plain object

    // Map the grades to only include their IDs
    if (transformedResult.policies) {
      transformedResult.policies.forEach(policy => {
        if (policy.grades) {
          policy.grades = policy.grades.map(grade => grade.salary_gradeId);
        }
      });
    }
    console.log("transformedResult", id);
    return transformedResult;
  }

  return null; // or handle the case where no result is found
};

/**
 * Update Item by id
 * @param {ObjectId} ReceiptId
 * @param {Object} updateBody
 * @returns {Promise<ReceiptModel>}
 */

// const updatereimbursement_configurationById = async (
//   Id,
//   updateBody,
//   updatedBy
// ) => {
//   const Item = await getreimbursement_configurationById(Id);
//   if (!Item) {
//     throw new ApiError(httpStatus.NOT_FOUND, "record not found");
//   }
//   const { subsidiaryId,payroll_groupId} = updateBody;
//   const exist = await Reimbursement_configurationModel.findOne({
//     where: {
//       Id: { [Op.ne]: Id },
//     [Op.or]: [
//       { subsidiaryId:subsidiaryId },
//       {payroll_groupId:payroll_groupId}
      
     
//     ]
//   }
//   });
//   if (exist) {
//     return {
//       message: "Already Exist.",
//       status: "error",
//     };
//   } else {
//     updateBody.updatedBy = updatedBy;
//     delete updateBody.id;
//     Object.assign(Item, updateBody);
//     await Item.save();
//     return Item;
//   }
// };



// const updatereimbursement_configurationById = async (
//   Id,
//   updateBody,
//   updatedBy
// ) => {

//   const { subsidiaryId,payroll_groupId} = updateBody;


//   const overlappingSubsidiary = await Reimbursement_configurationModel.findOne({
//     where: {
//         Id: { [Op.ne]: Id },
//       [Op.or]: [
//         { subsidiaryId},
//         { payroll_groupId },
        
       
//       ]
//     }
//   });
//   if (overlappingSubsidiary) {

// let result={"message":'New data overlaps with existing.',"status":"error"}
// return result;
// }
//   const Item = await Reimbursement_configurationModel.findOne({
//     where: { Id: Id },
//     include: [
//       {
//         model: Reimbursement_policies_detailModel,
//         as: "policies",
//       },
//     ],
//   });


//   if (!Item) {
//     throw new ApiError(httpStatus.NOT_FOUND, "Record not found");
//   }



//   const existingPolicyDetailIds = Item.policies.map(d => d.Id);

//   // Update or create child records
//   if (updateBody.policies && Array.isArray(updateBody.policies)) {
//     const newPolicyIds = [];

//     for (const policy of updateBody.policies) {
  
//       if (policy.Id) {
//         // Update existingPolicyDetailIds detail
   
//         const policyDetail = await Reimbursement_policies_detailModel.findOne({
//           where: { Id: policy.Id }
//         });

//         if (policyDetail) {

//           Object.assign(policyDetail, detail); // Apply updates
//           try {
//             await policyDetail.save();
//           } catch (error) {
//             console.error("Error saving policy detail:", error);
//           }
//         } else {
//           console.error("policy detail not found for Id:", policy.Id);
//         }
//         newPolicyIds.push(policy.Id);
//       } else {
//         // Create new detail if Id is not present
      
//         policy.reimbursement_configurationId = Item.Id; // Associate with the configuration ID
//         await Reimbursement_policies_detailModel.create(policy);
//         newDetailIds.push(detail.Id); // Add the new detail's Id
//       }
//     }

//     // Delete child records that are not present in the incoming details
//     for (const existingId of existingPolicyDetailIds) {

//       if (!newDetailIds.includes(existingId)) {
 
//         await Loan_management_detailModel.Loan_management_detailModel.destroy({
//           where: { Id: existingId }
//         });
//       }
//     }
//   }
//     // Update parent record
//   updateBody.updatedBy = updatedBy;
//   delete updateBody.id;
//   Object.assign(Item, updateBody);
//   await Item.save();

//   return Item;
// };


const updatereimbursement_configurationById = async (
  Id,
  updateBody,
  updatedBy
) => {
  const { subsidiaryId, payroll_groupId } = updateBody;
console.log(" subsidiaryId, payroll_groupId updateBody",updateBody)

const overlappingSubsidiary = await Reimbursement_configurationModel.findOne({
  where: {
    Id: { [Op.ne]: Id }, // Exclude the current record
    [Op.or]: [
      { subsidiaryId: subsidiaryId }, // Wrap in an object
      { payroll_groupId: payroll_groupId } // Wrap in an object
    ]
  }
});


  console.log(" subsidiaryId, payroll_groupId overlappingSubsidiary", overlappingSubsidiary)
  if (overlappingSubsidiary) {
    return { message: 'New data overlaps with existing.', status: "error" };
  }

  const Item = await Reimbursement_configurationModel.findOne({
    where: { Id: Id },
    include: [
      {
        model: Reimbursement_policies_detailModel,
        as: "policies",
        include: [{ model: Policies_grade_detailModel, as: "grades" }],
      },
      {
        model: Reimbursement_accounts_detailModel,
        as: "accounts",
      
      },
    ],
  });

  if (!Item) {
    throw new ApiError(httpStatus.NOT_FOUND, "Record not found");
  }

  const existingPolicyDetailIds = Item.policies.map(d => d.Id);


  // Update or create child records
  if (updateBody.policies && Array.isArray(updateBody.policies)) {
    const newPolicyIds = [];
  
    for (const policy of updateBody.policies) {
  

      if (policy.Id) {
        // Update existing policy detail
        const policyDetail = await Reimbursement_policies_detailModel.findOne({
          where: { Id: policy.Id },
          include: [{ model: Policies_grade_detailModel, as: "grades" }],
        });

        if (policyDetail) {
          await Policies_grade_detailModel.destroy({
            where: { reimbursement_policies_detailId: policyDetail.Id }
          });
    
          Object.assign(policyDetail, policy); // Apply updates
          await policyDetail.save();

 
          if (policy.grades && Array.isArray(policy.grades)) {
            console.log("policy.grades",policy.grades);
            
            // Create grade details, dynamically adding `salary_gradeId` if only IDs are sent
            await Policies_grade_detailModel.bulkCreate(
              policy.grades.map(gradeDetail => {
                // Check if gradeDetail is just an ID (number) and dynamically add the `salary_gradeId`
                if (typeof gradeDetail === 'number') {
                  return {
                    salary_gradeId: gradeDetail, // Add `salary_gradeId` when it's missing
                    reimbursement_policies_detailId: policyDetail.Id,
                  };
                }
      
              
                return {
                  ...gradeDetail,
                  reimbursement_policies_detailId: policyDetail.Id,
                };
              })
            );
          }
        } else {
          console.error("Policy detail not found for Id:", policy.Id);
        }
        newPolicyIds.push(policy.Id);
      } else {
        // Create new policy detail if Id is not present
        policy.reimbursement_configurationId = Item.Id; // Associate with the configuration ID
        const newPolicyDetail = await Reimbursement_policies_detailModel.create(policy);
        if (policy.grades && Array.isArray(policy.grades)) {
   
          
          // Create grade details, dynamically adding `salary_gradeId` if only IDs are sent
          await Policies_grade_detailModel.bulkCreate(
            policy.grades.map(gradeDetail => {
              // Check if gradeDetail is just an ID (number) and dynamically add the `salary_gradeId`
              if (typeof gradeDetail === 'number') {
                return {
                  salary_gradeId: gradeDetail, // Add `salary_gradeId` when it's missing
                  reimbursement_policies_detailId: newPolicyDetail.Id,
                };
              }
    
            
              return {
                ...gradeDetail,
                reimbursement_policies_detailId: newPolicyDetail.Id,
              };
            })
          );
        }
        // newPolicyIds.push(newPolicyDetail.Id);
      }
    }

    // Delete policies not present in the incoming details
    for (const existingId of existingPolicyDetailIds) {
      if (!newPolicyIds.includes(existingId)) {
        await Reimbursement_policies_detailModel.destroy({
          where: { Id: existingId }
        });
      }
    }
  }


  if (updateBody.accounts && Array.isArray(updateBody.accounts)) {
    const newAccountDetailIds = [];

    for (const account of updateBody.accounts) {
  
      if (account.Id) {
        // Update existing detail
   
        const accountchildDetail = await Reimbursement_accounts_detailModel.findOne({
          where: { Id: account.Id }
        });

        if (accountchildDetail) {

          Object.assign(accountchildDetail, account); // Apply updates
          try {
            await accountchildDetail.save();
          } catch (error) {
            console.error("Error saving child detail:", error);
          }
        } else {
          console.error("Child detail not found for Id:", account.Id);
        }
        newAccountDetailIds.push(account.Id);
      } else {
        // Create new detail if Id is not present

        account.reimbursement_configurationId = Item.Id; // Associate with the configuration ID
        await Reimbursement_accounts_detailModel.create(account);
        newAccountDetailIds.push(account.Id); // Add the new detail's Id
      }
    }
    const existingAccountDetailIds = Item.accounts.map(d => d.Id);
    // Delete child records that are not present in the incoming details
    for (const existingId of existingAccountDetailIds) {

      if (!newAccountDetailIds.includes(existingId)) {
 
        await Reimbursement_accounts_detailModel.destroy({
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

const deletereimbursement_configurationById = async (Id) => {
  const Item = await Reimbursement_configurationModel.findByPk(Id);
console.log("ID is deleted",Item)
  if (!Item) {
    throw new ApiError(httpStatus.NOT_FOUND, "Item not found");
  }

  await Item.destroy();
  return Item;
};



module.exports = {
  createreimbursement_configuration,
  getreimbursement_configurationById,
  updatereimbursement_configurationById,
  deletereimbursement_configurationById,
  queryreimbursement_configuration,
};
