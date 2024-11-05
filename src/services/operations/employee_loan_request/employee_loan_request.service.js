const httpStatus = require("http-status");
const {EmployeeSalaryModel, Employee_loan_requestModel,Loan_management_configurationModel ,EmployeeProfileModel,Loan_management_detailModel} = require("../../../models/index");

const ApiError = require("../../../utils/ApiError");
const Sequelize = require("sequelize");
const { paginationFacts } = require("../../../utils/common");
const { HttpStatusCodes } = require("../../../utils/constants");

const Op = Sequelize.Op;


const createEmployee_loan_request = async (req, Employee_loan_requestBody) => {
  try {
 

    let dataExists;

    if (Employee_loan_requestBody.Id) {
      // Check if a record with this ID already exists
      dataExists = await Employee_loan_requestModel.findOne({
        where: { Id: Employee_loan_requestBody.Id },
      });
    }

    // Set createdBy or updatedBy field
    const userId = req.user.id;
    if (dataExists) {
      // Update existing record
      Employee_loan_requestBody.updatedBy = userId;
      await dataExists.update(Employee_loan_requestBody);

      // Return the updated record
      return await getEmployee_loan_requestById(Employee_loan_requestBody.Id);
    } else {
      // Create new record
      Employee_loan_requestBody.createdBy = userId;
      const addedReimbursementClaim = await Employee_loan_requestModel.create(Employee_loan_requestBody);

      // Return the new record
      return await getEmployee_loan_requestById(addedReimbursementClaim.Id);
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
const queryEmployee_loan_request = async (
  filter,
  options,
  searchQuery,
  employeeId
) => {
  let limit = options.pageSize;
  let offset = 0 + (options.pageNumber - 1) * limit;

console.log("queryEmployee_loan_request employeeId",employeeId)

 let { count, rows } = await Employee_loan_requestModel.findAndCountAll({
    order: [["createdAt", "DESC"]],
    where: {
     employeeId
    },
    offset: offset,
    limit: limit,
  
    
        include: [
          
          {
            model: EmployeeProfileModel,
            attributes: ["firstName"],
            as: "Employee",
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


const getEmployee_loan_requestById = async (id) => {
  return Employee_loan_requestModel.findOne({
    where: { Id: id },

  });


};

/**
 * Update Item by id
 * @param {ObjectId} ReceiptId
 * @param {Object} updateBody
 * @returns {Promise<ReceiptModel>}
 */


const updateEmployee_loan_requestById = async (
  Id,
  updateBody,
  updatedBy
) => {

  const Item = await getEmployee_loan_requestById(Id);
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

const deleteEmployee_loan_requestById = async (Id) => {
  const Item = await Employee_loan_requestModel.findByPk(Id);

  if (!Item) {
    throw new ApiError(httpStatus.NOT_FOUND, "Item not found");
  }

  await Item.destroy();
  return Item;
};


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

const getloan_configurationDetailsById = async (Id) => {
  try {
    // Retrieve employee profile with joining date
    const employee = await EmployeeProfileModel.findOne({
      where: { Id: Id },
      attributes: ['Id', 'subsidiaryId','dateOfJoining'] // Ensure joiningDate is selected
    });

    // Check if employee is found
    if (!employee) {
      throw new Error('Employee not found');
    }
console.log("EmployeeSalaryModel Id",Id)
    // Retrieve compensation benefits with basic and gross salary
    const salary = await EmployeeSalaryModel.findOne({
      where: { employeeId: Id },
      attributes: ['grossSalary', 'basicSalary'] // Select basic and gross fields
    });

    // Check if salary detail is found
    console.log("EmployeeSalaryModel salary",salary)
    if (!salary) {
      throw new Error('Salary detail not found');
    }

    // Retrieve loan management configuration details
    const details = await Loan_management_configurationModel.findOne({
      where: {
        subsidiaryId: employee.subsidiaryId,
      },
      include: [
        {
          model: Loan_management_detailModel,
          as: "details", // Use the alias defined in the association
          attributes: { exclude: ['createdAt', 'updatedAt', 'createdBy', 'updatedBy'] } // Exclude unnecessary fields
        }
      ],
      attributes: { exclude: ['createdAt', 'updatedAt', 'createdBy', 'updatedBy'] } // Exclude unnecessary fields from main model
    });

    // Check if loan management configuration details are found
    if (!details) {
      throw new Error('Loan detail not found');
    }

    // Combine employee, salary, and loan details in the return object
    return {
      employee: {
        ...employee.toJSON(), // Convert Sequelize model instance to plain object
        joiningDate: employee.joiningDate // Include joining date
      },
      salary: {
        
        gross: salary.grossSalary,
        basic: salary.basicSalary,
      },
      loanDetails: details
    };

  } catch (error) {
    throw error; // Rethrow the error after logging it
  }
};



module.exports = {
  createEmployee_loan_request,
  getEmployee_loan_requestById,
  updateEmployee_loan_requestById,
  deleteEmployee_loan_requestById,
  queryEmployee_loan_request,
  getPayrollMonth,
  getloan_configurationDetailsById
};
