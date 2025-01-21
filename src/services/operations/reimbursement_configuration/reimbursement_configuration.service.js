const httpStatus = require("http-status");
const { Reimbursement_configurationModel, Reimbursement_policies_detailModel, Policies_grade_detailModel, Reimbursement_accounts_detailModel, SubsidiaryModel } = require("../../../models/index");
const { FormModel } = require("../../../models/index");

const ApiError = require("../../../utils/ApiError");
const Sequelize = require("sequelize");
const { paginationFacts, currentSubsidiaryPermission } = require("../../../utils/common");
const { HttpStatusCodes } = require("../../../utils/constants");

const Op = Sequelize.Op;


const createreimbursement_configuration = async (req, reimbursement_configurationBody) => {
  try {


    // Check if the parent configuration already exists
    const subsidiaryExists = await Reimbursement_configurationModel.findOne({
      where: {
        subsidiaryId: reimbursement_configurationBody.subsidiaryId,
        payroll_groupId: reimbursement_configurationBody.payroll_groupId,
      },
    });

    if (subsidiaryExists) {
      return {
        message: "Subsidiary & payroll group already exist",
        status: "error",
      };
    }

    // Set createdBy field
    reimbursement_configurationBody.createdBy = req.user.id;

    // Create the parent reimbursement configuration
    const addedReimbursementConfiguration = await Reimbursement_configurationModel.create(reimbursement_configurationBody);

    // Check if policies exist and create them
    if (addedReimbursementConfiguration && Array.isArray(reimbursement_configurationBody.policies)) {

      const createdPolicies = await Reimbursement_policies_detailModel.bulkCreate(
        reimbursement_configurationBody.policies.map(policy => ({
          ...policy,
          reimbursement_configurationId: addedReimbursementConfiguration.Id,
        }))
      );




      for (const policy of reimbursement_configurationBody.policies) {
        const createdPolicy = createdPolicies.find(p => p.reimbursement_typeId === policy.reimbursement_typeId);

        if (createdPolicy && Array.isArray(policy.grades)) {


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



    return await getreimbursement_configurationById(addedReimbursementConfiguration.Id);
    // return "Done"

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
const queryreimbursement_configuration = async (req,
  filter,
  options,
  searchQuery
) => {
  let limit = options.pageSize;
  let offset = 0 + (options.pageNumber - 1) * limit;

  searchQuery = searchQuery.toLowerCase();
  const queryFilters = [
 ,
    { search1: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col("Subsidiary.name")), 'LIKE', '%' + searchQuery + '%') },
    { search2: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col("PayrollGroup.formName")), 'LIKE', '%' + searchQuery + '%') },
    { search3: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('CycleType.formName')), 'LIKE', '%' + searchQuery + '%') },
  ];



  const { count, rows } = await Reimbursement_configurationModel.findAndCountAll({
    order: [
      ["Subsidiary", "name", "ASC"],
      ["PayrollGroup", "formName", "ASC"],   // Use the alias and attribute name instead of Sequelize.col()
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
        as: "PayrollGroup",
      },

      {
        model: FormModel,
        attributes: ["formName", "formCode"],
        as: "CycleType",
      },
      // {
      //   model: Reimbursement_policies_detailModel,
      //   as: "policies",
      //   include: [
      //     {
      //       model: Policies_grade_detailModel,
      //       as: "grades", // Ensure this matches the alias in the child model
      //       include: [
      //         {
      //           model: FormModel, // Include the salary grade model
      //           attributes: ["formName", "formCode"],
      //           as: "salary_grade", // Ensure this matches the alias in the grandchild model
      //         },
      //       ],
      //     },
      //   ],
      // },

      // {
      //   model: Reimbursement_accounts_detailModel,
      //   as: "accounts",
      //   include: [
      //     {
      //       model: FormModel,
      //       attributes: ["formName", "formCode"],
      //       as: "Reimbursement_type",
      //     },
      //     {
      //       model: FormModel,
      //       attributes: ["formName", "formCode"],
      //       as: "Expense_account",
      //     },
      //     {
      //       model: FormModel,
      //       attributes: ["formName", "formCode"],
      //       as: "Bank_account",
      //     },
      //   ],
      // },


    ],
  });

  return paginationFacts(rows?.length, limit, options.pageNumber, rows);
};

/**
 * Get Item by id
 * @param {ObjectId} id
 * @returns {Promise<ReceiptModel>}
 */



const getreimbursement_configurationById = async (id) => {


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
        model: SubsidiaryModel,
        attributes: ["name"],
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


const updatereimbursement_configurationById = async (
  Id,
  updateBody,
  updatedBy
) => {
  const { subsidiaryId, payroll_groupId } = updateBody;


  const overlappingSubsidiary = await Reimbursement_configurationModel.findOne({


    where: {
      Id: { [Op.ne]: Id }, // Exclude the current record by ID
      subsidiaryId: subsidiaryId,
      payroll_groupId: payroll_groupId,
    }
  });


  if (overlappingSubsidiary) {
    return { message: 'Subsidiary & payroll group already exist.', status: "error" };
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
            throw error
          }
        } else {

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
