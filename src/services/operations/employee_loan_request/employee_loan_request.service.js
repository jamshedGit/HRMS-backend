const httpStatus = require("http-status");
const {EmployeeSalaryModel, Employee_loan_requestModel,Loan_management_configurationModel ,EmployeeProfileModel,Loan_management_detailModel, PayrollMonthModel,FormModel,LoanTypeModel, Employee_loan_request_detailModel} = require("../../../models/index");

const ApiError = require("../../../utils/ApiError");
const Sequelize = require("sequelize");
const { paginationFacts } = require("../../../utils/common");
const { HttpStatusCodes } = require("../../../utils/constants");
const Employee_loan_request_detail = require("../../../models/operations/employee_loan_request/employee_loan_request_detail.model");

const Op = Sequelize.Op;



const createEmployee_loan_request = async (req, Employee_loan_requestBody) => {
  try {
    
    if (Employee_loan_requestBody.total_loan_amount < Employee_loan_requestBody.monthly_installment) {
    
       return {
        message: "Loan amount must be greater than monthly installment",
        status: "error",
      };
      // throw new ApiError('Loan amount must be greater than monthly installment');
    }

    const userId = req.user.id;

    // Initial setup
    Employee_loan_requestBody.loan_amount_remaining = Employee_loan_requestBody.total_loan_amount;
    Employee_loan_requestBody.createdBy = userId;

    // Create the parent loan request record
    const addedReimbursementClaim = await Employee_loan_requestModel.create(Employee_loan_requestBody);

    // Get the details for installments and add them to the detail table
    let remainingLoanAmount = Employee_loan_requestBody.total_loan_amount;
    let currentDate = new Date(Employee_loan_requestBody.installment_start_date);

    for (let i = 0; i < Employee_loan_requestBody.total_installment; i++) {
      let installmentAmount = Employee_loan_requestBody.monthly_installment;

      // Update the remaining loan balance after each installment
      // remainingLoanAmount -= installmentAmount;
      // if(remainingLoanAmount<installmentAmount){
      //   installmentAmount=remainingLoanAmount
      // }

      if (i === Employee_loan_requestBody.total_installment - 1) {
        installmentAmount = remainingLoanAmount; 
        remainingLoanAmount=0; // Adjust last installment to the remaining balance
      } else {
        remainingLoanAmount -= installmentAmount; // Deduct the regular installment from the remaining balance
      }

      // Create a detail entry for each installment
      await Employee_loan_request_detailModel.create({
        emp_loan_reqId: addedReimbursementClaim.Id,
        employeeId: Employee_loan_requestBody.employeeId,
        amount_received: installmentAmount,
        running_balance: remainingLoanAmount,
        payroll_month_date: currentDate,
        createdBy: userId,
      });

      // Move to the next month
      currentDate.setMonth(currentDate.getMonth() + 1);  // Increment the month by 1
    }

    // Return the new record along with its details
    return await getEmployee_loan_requestById(addedReimbursementClaim.Id);

  } catch (error) {
    
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



 let { count, rows } = await Employee_loan_requestModel.findAndCountAll({
    order: [["createdAt", "DESC"]],
    where: {
     employeeId
    },
    offset: offset,
    limit: limit,
  
    
        include: [
          
          {
            model:LoanTypeModel ,
            attributes: ["name"],
            as: "LoanType",
          },
          
     
       
          {
            model: FormModel,
            attributes: ["formName", "formCode"],
            as: "EmployeeLoanAccount",
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
    include:[
      {
        model: FormModel,
        attributes: ["formName", "formCode"],
        as: "EmployeeLoanAccount",
      },
      {
        model: FormModel,
        attributes: ["formName", "formCode"],
        as: "EmployeeLoanAccount",
      },
      {
        model: Employee_loan_request_detail,
        attributes: ["is_deducted"],
        as: "details",
        where: {
          is_deducted: true,  // Only include details where is_deducted is true
        },
        required: false,
      },



    ]
 

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

  if(updateBody.total_loan_amount<updateBody.monthly_installment){
    return {
      message: "Loan amount must be greater than monthly installment",
      status: "error",
    };

    // throw new Error('Loan amount must be greater');

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

  const checkRecordsWithDeduction = await Employee_loan_request_detail.findAll({
    where: {
      emp_loan_reqId: Id,
      is_deducted: true
    }
  });

  // Step 3: If there are child records with deductions, prevent deletion
  if (checkRecordsWithDeduction.length > 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Unable to delete: This transaction is already processed for previous months");
  }
  

  await Item.destroy();
  return Item;
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

    // Retrieve compensation benefits with basic and gross salary
    const salary = await EmployeeSalaryModel.findOne({
      where: { employeeId: Id },
      attributes: ['grossSalary', 'basicSalary'] // Select basic and gross fields
    });

    // Check if salary detail is found

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

    

    const payroll_month= await PayrollMonthModel.findOne({
      order: [
        ['createdAt', 'DESC']
      ],
      where: {
       
        isActive: true
      },
     
    });
  
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
      loanDetails: details,
      payroll:payroll_month

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
  getloan_configurationDetailsById
};
