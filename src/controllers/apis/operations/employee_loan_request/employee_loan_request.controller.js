const httpStatus = require("http-status");
const pick = require("../../../../utils/pick");
const ApiError = require("../../../../utils/ApiError");
const catchAsync = require("../../../../utils/catchAsync");
const { Employee_loan_requestService } = require("../../../../services/index");


const {
    HttpStatusCodes,
    HttpResponseMessages,
} = require("../../../../utils/constants");

const createEmployee_loan_request = catchAsync(async (req, res) => {

    try {


        const Employee_loan_request = await Employee_loan_requestService.createEmployee_loan_request(req, req.body);

        if (Employee_loan_request?.status && Employee_loan_request?.status === "error") {

            res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({
                code: HttpStatusCodes.INTERNAL_SERVER_ERROR,
                message: Employee_loan_request.message,
                error: Employee_loan_request.error || 'An unexpected error occurred',
            });


        }
        else {
         

            res.status(httpStatus.CREATED).send({
                code: HttpStatusCodes.CREATED,
                message: HttpResponseMessages.CREATED,
                data: Employee_loan_request
            });
        }

    } catch (error) {
        
    }
});


const getAllEmployee_loan_request = catchAsync(async (req, res) => {
   
    const obj = {};
    const filter = obj;

    const options = pick(req.body.queryParams, ['sortOrder', 'pageSize', 'pageNumber']);

    const searchQuery = req.body.queryParams.filter.searchQuery ? req.body.queryParams.filter.searchQuery : '';

    const result = await Employee_loan_requestService.queryEmployee_loan_request(filter, options, searchQuery,req.body.employeeId);



    if (result.status == "error") {

        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({
            code: HttpStatusCodes.INTERNAL_SERVER_ERROR,
            message: result.message,
            error: result.error || 'An unexpected error occurred',
        });


    }
    else {

        res.status(httpStatus.CREATED).send({
            code: HttpStatusCodes.CREATED,
            message: HttpResponseMessages.CREATED,
            data: result
        });
    }
});

const getEmployee_loan_requestById = catchAsync(async (req, res) => {

    const Receipt = await Employee_loan_requestService.getEmployee_loan_requestById(req.body.Id);
    if (!Receipt) {
        throw new ApiError(httpStatus.NOT_FOUND, "Data not found");
    }
    res.send({
        code: HttpStatusCodes.OK,
        message: HttpResponseMessages.OK,
        data: Receipt,
    });



});

const updateEmployee_loan_request = catchAsync(async (req, res) => {
    console.log("req.body.dataupdate",req.body,req.user.Id)
    const Employee_loan_request = await Employee_loan_requestService.updateEmployee_loan_requestById(req.body.Id, req.body, req.user.Id);


    if (Employee_loan_request?.status == "error") {

        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({
            code: HttpStatusCodes.INTERNAL_SERVER_ERROR,
            message: Employee_loan_request.message,
            error: Employee_loan_request.error || 'An unexpected error occurred',
        });


    }
    else {

        res.status(httpStatus.CREATED).send({
            code: HttpStatusCodes.CREATED,
            message: HttpResponseMessages.UPDATED,
            data: Employee_loan_request
        });
    }

});

const deleteEmployee_loan_request = catchAsync(async (req, res) => {
 
    const Receipt = await Employee_loan_requestService.deleteEmployee_loan_requestById(req.body.Id);
    res.send({
        code: HttpStatusCodes.OK,
        message: HttpResponseMessages.OK,
        data: Receipt,
    });
});



    const getPayrollMonth = catchAsync(async (req, res) => {


        const result = await Employee_loan_requestService.getPayrollMonth();
      
        res.send({
          code: HttpStatusCodes.OK,
          message: HttpResponseMessages.OK,
          data: result,
        });
      });


const getloan_configurationDetailsById = catchAsync(async (req, res) => {
 
        const details = await Employee_loan_requestService.getloan_configurationDetailsById(req.body.Id);
        if (!details) {
            throw new ApiError(httpStatus.NOT_FOUND, "Details not found");
        }
        res.send({
            code: HttpStatusCodes.OK,
            message: HttpResponseMessages.OK,
            data: details,
        });
    
    
    
    });
    

    const update_approved_statusById = catchAsync(async (req, res) => {

        const Receipt = await Employee_loan_requestService.update_approved_statusById(req.body.data);
        if (!Receipt) {
            throw new ApiError(httpStatus.NOT_FOUND, "Data not found");
        }
        res.send({
            code: HttpStatusCodes.OK,
            message: HttpResponseMessages.OK,
            data: Receipt,
        });
    
    
    
    });
    

module.exports = {
    createEmployee_loan_request,
    getAllEmployee_loan_request,
    getEmployee_loan_requestById,
    updateEmployee_loan_request,
    deleteEmployee_loan_request,
    getPayrollMonth,
    getloan_configurationDetailsById,
    update_approved_statusById,
};
