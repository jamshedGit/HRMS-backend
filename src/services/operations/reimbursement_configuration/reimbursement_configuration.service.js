const httpStatus = require("http-status");
const { Reimbursement_configurationModel,Reimbursement_policies_detailModel,Policies_grade_detailModel } = require("../../../models/index");
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


const getreimbursement_configurationById = async (id) => {
  console.log("final id",id)
  // let a= await Reimbursement_configurationModel.findOne({
  //   where: { Id:id },
  //   include: [
  //     {
  //       model:Reimbursement_policies_detailModel,
  //       as: "policies",
  //       include: [
  //         {
  //           model: Policies_grade_detailModel,
  //           as: "grades",
  //         },
  //       ],
  //     },
  //     {
  //       model:FormModel,
  //       attributes: ["formName", "formCode"],
  //       as: "Subsidiary",
  //     },


  //   ],
  // });

 
return await Reimbursement_configurationModel.findOne({

  where: { Id:id },

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
  const Item = await getreimbursement_configurationById(Id);
  if (!Item) {
    throw new ApiError(httpStatus.NOT_FOUND, "record not found");
  }

  const exist = await Reimbursement_configurationModel.findOne({
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
    return Item;
  }
};

/**
 * Delete Item by id
 * @param {ObjectId} Id
 * @returns {Promise<ReceiptModel>}
 */

// const deletereimbursement_configurationById = async (Id) => {
//   const Item = await getreimbursement_configurationById(Id, {});

//   if (!Item) {
//     throw new ApiError(httpStatus.NOT_FOUND, "Item not found");
//   }

//   await Item.destroy();
//   return Item;
// };


const deletereimbursement_configurationById = async (Id) => {
  // Fetch the parent model (reimbursement configuration)
  const Item = await getreimbursement_configurationById(Id, {
    include: [
      {
        model: Reimbursement_policies_detailModel, // Replace with actual child model name
        as: 'policies',    // Assuming 'children' is the alias
        include: [
          {
            model: Policies_grade_detailModel, // Replace with actual grandchild model name
            as: 'grades',    // Assuming 'grandchildren' is the alias
          },
        ],
      },
    ],
  });

  // If the item doesn't exist, throw an error
  if (!Item) {
    throw new ApiError(httpStatus.NOT_FOUND, "Item not found");
  }

  // Loop through and delete all grandchildren first
  for (const policy of Item.policies) {
    for (const grade of policy.grades) {
      await grade.destroy(); // Destroy grandchild first
    }

    await policy.destroy(); // Destroy child after all grandchildren are deleted
  }

  // Finally, destroy the parent item
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
