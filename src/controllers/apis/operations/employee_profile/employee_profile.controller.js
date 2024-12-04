const httpStatus = require("http-status");
const pick = require("../../../../utils/pick");
const ApiError = require("../../../../utils/ApiError");
const catchAsync = require("../../../../utils/catchAsync");
const {employee_profileService } = require("../../../../services/index");


const {
    HttpStatusCodes,
    HttpResponseMessages,
} = require("../../../../utils/constants");

const createemployee_profile = catchAsync(async (req, res) => {

    try {


        const employee_profile = await employee_profileService.createemployee_profile(req, req.body);

        if (employee_profile?.status && employee_profile.status === "error") {

            res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({
                code: HttpStatusCodes.INTERNAL_SERVER_ERROR,
                message: employee_profile.message,
                error: employee_profile.error || 'An unexpected error occurred',
            });


        }
        else {
  

            res.status(httpStatus.CREATED).send({
                code: HttpStatusCodes.CREATED,
                message: HttpResponseMessages.CREATED,
                data: employee_profile
            });
        }

    } catch (error) {
        throw error; 
    }
});

const getAllemployee_profile = catchAsync(async (req, res) => {

    const obj = {};
    const filter = obj;
    // const options = pick(req.body, ["sortBy", "limit", "page"]);
    const options = pick(req?.body?.queryParams, ['sortOrder', 'pageSize', 'pageNumber']);
    const searchQuery = req?.body?.queryParams?.filter.searchQuery ? req?.body?.queryParams?.filter.searchQuery : '';

    const result = await employee_profileService.queryemployee_profile(filter, options, searchQuery);

    res.send({
        code: HttpStatusCodes.OK,
        message: HttpResponseMessages.OK,
        data: result,
    });
});




const getemployee_profileById = catchAsync(async (req, res) => {
  
    const Receipt = await employee_profileService.getemployee_profileById(req.body.Id);
    if (!Receipt) {
        throw new ApiError(httpStatus.NOT_FOUND, "Receipt not found");
    }
    res.send({
        code: HttpStatusCodes.OK,
        message: HttpResponseMessages.OK,
        data: Receipt,
    });
});

const updateemployee_profile = catchAsync(async (req, res) => {

    const employee_profile = await employee_profileService.updateemployee_profileById(req.body.Id, req.body, req.user.Id);


    if (employee_profile.status == "error") {

        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({
            code: HttpStatusCodes.INTERNAL_SERVER_ERROR,
            message: employee_profile.message,
            error: employee_profile.error || 'An unexpected error occurred',
        });


    }
    else {

        res.status(httpStatus.CREATED).send({
            code: HttpStatusCodes.CREATED,
            message: HttpResponseMessages.UPDATED,
            data: employee_profile
        });
    }

});

const deleteemployee_profile = catchAsync(async (req, res) => {

    const Receipt = await employee_profileService.deleteemployee_profileById(req.body.Id);
    res.send({
        code: HttpStatusCodes.OK,
        message: HttpResponseMessages.OK,
        data: Receipt,
    });
});



module.exports = {
    createemployee_profile,
    getAllemployee_profile,
    getemployee_profileById,
    updateemployee_profile,
    deleteemployee_profile,

};
