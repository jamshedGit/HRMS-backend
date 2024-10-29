const httpStatus = require("http-status");
const pick = require("../../../../utils/pick");
const ApiError = require("../../../../utils/ApiError");
const catchAsync = require("../../../../utils/catchAsync");
const { reimbursement_claimService } = require("../../../../services/index");


const {
    HttpStatusCodes,
    HttpResponseMessages,
} = require("../../../../utils/constants");

const createreimbursement_claim = catchAsync(async (req, res) => {

    try {


        const reimbursement_claim = await reimbursement_claimService.createreimbursement_claim(req, req.body);

        if (reimbursement_claim?.status && reimbursement_claim.status === "error") {

            res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({
                code: HttpStatusCodes.INTERNAL_SERVER_ERROR,
                message: reimbursement_claim.message,
                error: reimbursement_claim.error || 'An unexpected error occurred',
            });


        }
        else {
            console.log("created")

            res.status(httpStatus.CREATED).send({
                code: HttpStatusCodes.CREATED,
                message: HttpResponseMessages.CREATED,
                data: reimbursement_claim
            });
        }

    } catch (error) {
        console.log(error);
    }
});


const getAllreimbursement_claim = catchAsync(async (req, res) => {
console.log("req.body",req.body)
    const obj = {};
    const filter = obj;
    // const options = pick(req.body, ["sortBy", "limit", "page"]);
    // const options = pick(req.body, req.body.queryParams['sortOrder', 'pageSize', 'pageNumber']);
    const options = pick(req.body.queryParams, ['sortOrder', 'pageSize', 'pageNumber']);

    const searchQuery = req.body.queryParams.filter.searchQuery ? req.body.queryParams.filter.searchQuery : '';

    const result = await reimbursement_claimService.queryreimbursement_claim(filter, options, searchQuery,req.body.employeeId);
    console.log(result);
    // res.send({
    //     code: HttpStatusCodes.OK,
    //     message: HttpResponseMessages.OK,
    //     data: result,
    // });

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

const getreimbursement_claimById = catchAsync(async (req, res) => {
    console.log(req.body)
    const Receipt = await reimbursement_claimService.getreimbursement_claimById(req.body.Id);
    if (!Receipt) {
        throw new ApiError(httpStatus.NOT_FOUND, "Receipt not found");
    }
    res.send({
        code: HttpStatusCodes.OK,
        message: HttpResponseMessages.OK,
        data: Receipt,
    });



});

const updatereimbursement_claim = catchAsync(async (req, res) => {
    console.log(req.body);
    const reimbursement_claim = await reimbursement_claimService.updatereimbursement_claimById(req.body.Id, req.body, req.user.Id);

console.log("updated status",reimbursement_claim)
    if (reimbursement_claim.status == "error") {

        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({
            code: HttpStatusCodes.INTERNAL_SERVER_ERROR,
            message: reimbursement_claim.message,
            error: reimbursement_claim.error || 'An unexpected error occurred',
        });


    }
    else {

        res.status(httpStatus.CREATED).send({
            code: HttpStatusCodes.CREATED,
            message: HttpResponseMessages.CREATED,
            data: reimbursement_claim
        });
    }

});

const deletereimbursement_claim = catchAsync(async (req, res) => {
    console.log("req.body.Id ", req.body.Id)
    const Receipt = await reimbursement_claimService.deletereimbursement_claimById(req.body.Id);
    res.send({
        code: HttpStatusCodes.OK,
        message: HttpResponseMessages.OK,
        data: Receipt,
    });
});



module.exports = {
    createreimbursement_claim,
    getAllreimbursement_claim,
    getreimbursement_claimById,
    updatereimbursement_claim,
    deletereimbursement_claim,

};
