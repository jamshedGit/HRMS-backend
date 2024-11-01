const httpStatus = require("http-status");
const { Reimbursement_claimModel,Reimbursement_configurationModel ,EmployeeProfileModel,PayrollMonthModel} = require("../../../models/index");
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

// const getPayrollMonth = async () => {
//   const result = await PayrollMonthModel.findAndCountAll({
//     order: [['createdAt', 'DESC']],
//   });

//   // Month mapping
//   const monthNames = [
//     'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 
//     'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
//   ];

//   // Format the results into an array of objects
//   const formattedMonths = result.rows.map(row => {
//     const month = monthNames[row.month - 1]; // Convert month number to month name
//     const year = row.year;
//     return { Id: row.Id, month: `${month} ${year}` }; // Create an object with Id and month
//   });

//   // final response 
//   return  formattedMonths // Return the array 

// };

// // Example usage
// getPayrollMonth().then(response => {
//   console.log(response);
// }).catch(err => {
//   console.error(err);
// });

const getPayrollMonth = async () => {
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  
  const result = await PayrollMonthModel.findAndCountAll({});

  // Sort the rows by year in descending order
  result.rows.sort((a, b) => b.year - a.year || b.month - a.month);

  // Map the results to the desired format
  const formattedResult = result.rows.map(row => ({
    value: row.Id, // Assuming 'id' is the field for the unique identifier
    label: `${monthNames[row.month - 1]} ${row.year}` // Convert month number to name
  }));

  return  formattedResult
  
};



// const getPayrollMonth = async () => {
//   const result = await PayrollMonthModel.findAndCountAll({
//     order: [['createdAt', 'DESC']],
//   });

//   // Month mapping for sorting
//   const monthNames = [
//     'DEC', 'NOV', 'OCT', 'SEP', 'AUG', 'JUL', 
//     'JUN', 'MAY', 'APR', 'MAR', 'FEB', 'JAN'
//   ];

//   // Format the results into an array of objects
//   const formattedMonths = result.rows.map(row => {
//     const month = monthNames[12 - row.month]; // Convert month number to month name (reverse order)
//     const year = row.year;
//     return { Id: row.Id, month: `${month} ${year}` }; // Create an object with Id and month
//   });

//   // Sort the months: first by month index, then by year descending
//   formattedMonths.sort((a, b) => {
//     const [monthA, yearA] = a.month.split(" ");
//     const [monthB, yearB] = b.month.split(" ");

//     // Compare months by their reverse index (DEC first)
//     const monthComparison = monthNames.indexOf(monthA) - monthNames.indexOf(monthB);
    
//     // If months are different, sort by month
//     if (monthComparison !== 0) {
//       return monthComparison;
//     }

//     // If months are the same, sort by year descending
//     return yearB - yearA; 
//   });

//   // Create the final response object
//   return {
//     code: 200,
//     message: "Successfully",
//     data: formattedMonths // Return the sorted array of objects
//   };
// };

// // Example usage
// getPayrollMonth().then(response => {
//   console.log(response);
// }).catch(err => {
//   console.error(err);
// });

module.exports = {
  createreimbursement_claim,
  getreimbursement_claimById,
  updatereimbursement_claimById,
  deletereimbursement_claimById,
  queryreimbursement_claim,
  getPayrollMonth
};
