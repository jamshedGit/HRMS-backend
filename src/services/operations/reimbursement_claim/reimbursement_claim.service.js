const httpStatus = require("http-status");
const { Reimbursement_claimModel,Reimbursement_configurationModel ,EmployeeProfileModel} = require("../../../models/index");
const { FormModel } = require("../../../models/index");

const ApiError = require("../../../utils/ApiError");
const Sequelize = require("sequelize");
const { paginationFacts } = require("../../../utils/common");
const { HttpStatusCodes } = require("../../../utils/constants");

const Op = Sequelize.Op;

const createreimbursement_claim = async (req, reimbursement_claimBody) => {
  try {
    console.log("Creating reimbursement configuration...", reimbursement_claimBody.data);

    // // Check if the parent configuration already exists
    // const subsidiaryExists = await Reimbursement_claimModel.findOne({
    //   where: {
    //     employeeId: reimbursement_claimBody.employeeId,
    //   },
    // });

    // if (subsidiaryExists) {
    //   return {
    //     message: "Subsidiary & payroll group already exist",
    //     status: "error",
    //   };
    // }

    // Set createdBy field
    reimbursement_claimBody.createdBy = req.user.id;

    // If a file was uploaded, add its location to reimbursement_claimBody
    // if (req.file) {
    //   reimbursement_claimBody.attachment = req.file.path; // Assuming req.file.path contains the file path
    // } else {
    //   return {
    //     message: "File upload is required",
    //     status: "error",
    //   };
    // }

    // Create the parent reimbursement configuration
    const addedReimbursementConfiguration = await Reimbursement_claimModel.create(reimbursement_claimBody);

    return await getreimbursement_claimById(addedReimbursementConfiguration.Id);
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
const queryreimbursement_claim = async (
  filter,
  options,
  searchQuery,
  employeeId
) => {
  let limit = options.pageSize;
  let offset = 0 + (options.pageNumber - 1) * limit;

console.log("reimbursement_claim employeeId claim_body",employeeId
)

 let { count, rows } = await Reimbursement_claimModel.findAndCountAll({
    order: [["createdAt", "DESC"]],
    where: {
     employeeId
    },
    offset: offset,
    limit: limit,
  
    
        include: [
          {
            model: FormModel,
            attributes: ["formName", "formCode"],
            as: "ReimbursementType",
          },
          {
            model: EmployeeProfileModel,
            attributes: ["firstName"],
            as: "Employee",
          },
          {
            model: Reimbursement_configurationModel,
            attributes: ["subsidiaryId","payroll_groupId"],
            as: "ReimbursementConfiguration",
          },
       
    
    ],
   
  });

  if(count && rows)
  {
    return paginationFacts(count, limit, options.pageNumber, rows);
  }    
  else {
      // return {
      //   message: "Data not present",
      //   status: "error",
      // };
      return  paginationFacts(count, limit, options.pageNumber, rows=[]);
    }
  
};

/**
 * Get Item by id
 * @param {ObjectId} id
 * @returns {Promise<ReceiptModel>}
 */







const getreimbursement_claimById = async (id) => {
  return Reimbursement_claimModel.findOne({
    where: { Id: id },
    include: [
      {
        model: FormModel,
        attributes: ["formName", "formCode"],
        as: "ReimbursementType",
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


const updatereimbursement_claimById = async (
  Id,
  updateBody,
  updatedBy
) => {
  const { subsidiaryId, payroll_groupId } = updateBody;
console.log(" subsidiaryId, payroll_groupId updateBody",updateBody)

const overlappingSubsidiary = await Reimbursement_claimModel.findOne({
  // where: {
  //   Id: { [Op.ne]: Id }, // Exclude the current record
  //   [Op.or]: 
  //   [
  //     { subsidiaryId: subsidiaryId }, // Wrap in an object
  //     { payroll_groupId: payroll_groupId } // Wrap in an object
  //   ]
  // }

  where: {
    Id: { [Op.ne]: Id }, // Exclude the current record by ID
    subsidiaryId: subsidiaryId,
    payroll_groupId: payroll_groupId,
  }
});

  console.log(" subsidiaryId, payroll_groupId overlappingSubsidiary", overlappingSubsidiary)
  if (overlappingSubsidiary) {
    return { message: 'Subsidiary & payroll group already exist.', status: "error" };
  }

  const Item = await Reimbursement_claimModel.findOne({
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
        policy.reimbursement_claimId = Item.Id; // Associate with the configuration ID
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

        account.reimbursement_claimId = Item.Id; // Associate with the configuration ID
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

const deletereimbursement_claimById = async (Id) => {
  const Item = await Reimbursement_claimModel.findByPk(Id);
console.log("ID is deleted",Item)
  if (!Item) {
    throw new ApiError(httpStatus.NOT_FOUND, "Item not found");
  }

  await Item.destroy();
  return Item;
};



module.exports = {
  createreimbursement_claim,
  getreimbursement_claimById,
  updatereimbursement_claimById,
  deletereimbursement_claimById,
  queryreimbursement_claim,
};
