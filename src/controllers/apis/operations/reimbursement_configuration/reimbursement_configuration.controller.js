const httpStatus = require("http-status");
const pick = require("../../../../utils/pick");
const ApiError = require("../../../../utils/ApiError");
const catchAsync = require("../../../../utils/catchAsync");
const { reimbursement_configurationService } = require("../../../../services/index");


const {
    HttpStatusCodes,
    HttpResponseMessages,
} = require("../../../../utils/constants");

const createreimbursement_configuration = catchAsync(async (req, res) => {

    try {


        const reimbursement_configuration = await reimbursement_configurationService.createreimbursement_configuration(req, req.body);

        if (reimbursement_configuration?.status && reimbursement_configuration.status === "error") {

            res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({
                code: HttpStatusCodes.INTERNAL_SERVER_ERROR,
                message: reimbursement_configuration.message,
                error: reimbursement_configuration.error || 'An unexpected error occurred',
            });


        }
        else {
            console.log("created")

            res.status(httpStatus.CREATED).send({
                code: HttpStatusCodes.CREATED,
                message: HttpResponseMessages.CREATED,
                data: reimbursement_configuration
            });
        }

    } catch (error) {
        console.log(error);
    }
});


const getAllreimbursement_configuration = catchAsync(async (req, res) => {

    const obj = {};
    const filter = obj;
    // const options = pick(req.body, ["sortBy", "limit", "page"]);
    const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
    const searchQuery = req.body.filter.searchQuery ? req.body.filter.searchQuery : '';

    const result = await reimbursement_configurationService.queryreimbursement_configuration(filter, options, searchQuery);
    console.log(result);
    res.send({
        code: HttpStatusCodes.OK,
        message: HttpResponseMessages.OK,
        data: result,
    });
});

const getreimbursement_configurationById = catchAsync(async (req, res) => {
    console.log(req.body)
    const Receipt = await reimbursement_configurationService.getreimbursement_configurationById(req.body.Id);
    if (!Receipt) {
        throw new ApiError(httpStatus.NOT_FOUND, "Receipt not found");
    }
    res.send({
        code: HttpStatusCodes.OK,
        message: HttpResponseMessages.OK,
        data: Receipt,
    });
});

const updatereimbursement_configuration = catchAsync(async (req, res) => {
    console.log(req.body);
    const reimbursement_configuration = await reimbursement_configurationService.updatereimbursement_configurationById(req.body.Id, req.body, req.user.Id);

console.log("updated status",reimbursement_configuration)
    if (reimbursement_configuration.status == "error") {

        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({
            code: HttpStatusCodes.INTERNAL_SERVER_ERROR,
            message: reimbursement_configuration.message,
            error: reimbursement_configuration.error || 'An unexpected error occurred',
        });


    }
    else {

        res.status(httpStatus.CREATED).send({
            code: HttpStatusCodes.CREATED,
            message: HttpResponseMessages.CREATED,
            data: reimbursement_configuration
        });
    }

});

const deletereimbursement_configuration = catchAsync(async (req, res) => {
    console.log("req.body.Id ", req.body.Id)
    const Receipt = await reimbursement_configurationService.deletereimbursement_configurationById(req.body.Id);
    res.send({
        code: HttpStatusCodes.OK,
        message: HttpResponseMessages.OK,
        data: Receipt,
    });
});



module.exports = {
    createreimbursement_configuration,
    getAllreimbursement_configuration,
    getreimbursement_configurationById,
    updatereimbursement_configuration,
    deletereimbursement_configuration,

};
