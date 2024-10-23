const httpStatus = require("http-status");
const pick = require("../../../../utils/pick");
const ApiError = require("../../../../utils/ApiError");
const catchAsync = require("../../../../utils/catchAsync");
const { accrue_gratuity_configurationService } = require("../../../../services/index");


const {
    HttpStatusCodes,
    HttpResponseMessages,
} = require("../../../../utils/constants");

const createaccrue_gratuity_configuration = catchAsync(async (req, res) => {

    try {


        const accrue_gratuity_configuration = await accrue_gratuity_configurationService.createaccrue_gratuity_configuration(req, req.body);

        if (accrue_gratuity_configuration?.status && accrue_gratuity_configuration.status === "error") {

            res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({
                code: HttpStatusCodes.INTERNAL_SERVER_ERROR,
                message: accrue_gratuity_configuration.message,
                error: accrue_gratuity_configuration.error || 'An unexpected error occurred',
            });


        }
        else {
  

            res.status(httpStatus.CREATED).send({
                code: HttpStatusCodes.CREATED,
                message: HttpResponseMessages.CREATED,
                data: accrue_gratuity_configuration
            });
        }

    } catch (error) {
        console.log(error);
    }
});


const getAllaccrue_gratuity_configuration = catchAsync(async (req, res) => {

    const obj = {};
    const filter = obj;
    // const options = pick(req.body, ["sortBy", "limit", "page"]);
    const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
    const searchQuery = req.body.filter.searchQuery ? req.body.filter.searchQuery : '';

    const result = await accrue_gratuity_configurationService.queryaccrue_gratuity_configuration(filter, options, searchQuery);

    res.send({
        code: HttpStatusCodes.OK,
        message: HttpResponseMessages.OK,
        data: result,
    });
});

const getaccrue_gratuity_configurationById = catchAsync(async (req, res) => {
  
    const Receipt = await accrue_gratuity_configurationService.getaccrue_gratuity_configurationById(req.body.Id);
    if (!Receipt) {
        throw new ApiError(httpStatus.NOT_FOUND, "Receipt not found");
    }
    res.send({
        code: HttpStatusCodes.OK,
        message: HttpResponseMessages.OK,
        data: Receipt,
    });
});

const updateaccrue_gratuity_configuration = catchAsync(async (req, res) => {

    const accrue_gratuity_configuration = await accrue_gratuity_configurationService.updateaccrue_gratuity_configurationById(req.body.Id, req.body, req.user.Id);


    if (accrue_gratuity_configuration.status == "error") {

        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({
            code: HttpStatusCodes.INTERNAL_SERVER_ERROR,
            message: accrue_gratuity_configuration.message,
            error: accrue_gratuity_configuration.error || 'An unexpected error occurred',
        });


    }
    else {

        res.status(httpStatus.CREATED).send({
            code: HttpStatusCodes.CREATED,
            message: HttpResponseMessages.CREATED,
            data: accrue_gratuity_configuration
        });
    }

});

const deleteaccrue_gratuity_configuration = catchAsync(async (req, res) => {

    const Receipt = await accrue_gratuity_configurationService.deleteaccrue_gratuity_configurationById(req.body.Id);
    res.send({
        code: HttpStatusCodes.OK,
        message: HttpResponseMessages.OK,
        data: Receipt,
    });
});



module.exports = {
    createaccrue_gratuity_configuration,
    getAllaccrue_gratuity_configuration,
    getaccrue_gratuity_configurationById,
    updateaccrue_gratuity_configuration,
    deleteaccrue_gratuity_configuration,

};
