const httpStatus = require("http-status");
const { Reimbursement_claimModel,Reimbursement_configurationModel ,EmployeeProfileModel} = require("../../../models/index");
const { FormModel } = require("../../../models/index");

const ApiError = require("../../../utils/ApiError");
const Sequelize = require("sequelize");
const { paginationFacts } = require("../../../utils/common");
const { HttpStatusCodes } = require("../../../utils/constants");

const Op = Sequelize.Op;

// const createreimbursement_claim = async (req, reimbursement_claimBody) => {
//   try {
//     console.log("Creating reimbursement configuration...", reimbursement_claimBody);
//     let  dataExists;
//     if(reimbursement_claimBody.Id){
//        dataExists = await Reimbursement_claimModel.findOne({
//       where: {
//         Id: reimbursement_claimBody.Id,
//       },
//     });
//     }


//     if (dataExists) {
  
//     }

//     // Set createdBy field
//     reimbursement_claimBody.createdBy = req.user.id;



//     // Create the parent reimbursement configuration
//     const addedReimbursementClaim = await Reimbursement_claimModel.create(reimbursement_claimBody);

//     return await getreimbursement_claimById(addedReimbursementClaim.Id);
//   } catch (error) {
//     console.error("Error creating reimbursement configuration:", error);
//     throw error; // Rethrow or handle the error as needed
//   }
// };

const createreimbursement_claim = async (req, reimbursement_claimBody) => {
  try {
    console.log("Processing reimbursement claim...", reimbursement_claimBody);

    let dataExists;

    if (reimbursement_claimBody.Id) {
      // Check if a record with this ID already exists
      dataExists = await Reimbursement_claimModel.findOne({
        where: { Id: reimbursement_claimBody.Id },
      });
    }

    // Set createdBy or updatedBy field
    const userId = req.user.id;
    if (dataExists) {
      // Update existing record
      reimbursement_claimBody.updatedBy = userId;
      await dataExists.update(reimbursement_claimBody);

      // Return the updated record
      return await getreimbursement_claimById(reimbursement_claimBody.Id);
    } else {
      // Create new record
      reimbursement_claimBody.createdBy = userId;
      const addedReimbursementClaim = await Reimbursement_claimModel.create(reimbursement_claimBody);

      // Return the new record
      return await getreimbursement_claimById(addedReimbursementClaim.Id);
    }
  } catch (error) {
    console.error("Error processing reimbursement claim:", error);
    throw error;
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
    console.log("count && rows")
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
console.log(" Id,updateBody,updatedBy", Id,updateBody,updatedBy)
  const Item = await getreimbursement_claimById(Id);
  if (!Item) {
    throw new ApiError(httpStatus.NOT_FOUND, "Record not found");
  }

  
  
  updateBody.updatedBy = updatedBy;
  delete updateBody.id;
  Object.assign(Item, updateBody);
  await Item.save();
  return  Item;

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
