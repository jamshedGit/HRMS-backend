const httpStatus = require("http-status");
const pick = require("../../../../utils/pick");
const ApiError = require("../../../../utils/ApiError");
const catchAsync = require("../../../../utils/catchAsync");
const { coffinFormService } = require("../../../../services");
const {
    HttpStatusCodes,
    HttpResponseMessages,
} = require("../../../../utils/constants");

const createCoffinForm = catchAsync(async (req, res) => {
    const coffinFormCreated = await coffinFormService.createCoffinForm(req,req.body);
    // console.log("Latest created Id",coffinFormCreated.id)
    if (!coffinFormCreated) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Coffin form not created something went wrong!');
    }
    res.send({
        code: HttpStatusCodes.OK,
        message: HttpResponseMessages.OK,
        data: coffinFormCreated
    });
});

const updateCoffinForm = catchAsync(async (req, res) => {
    const updatedCoffinForm = await coffinFormService.updateCoffinForm(req, req.body);
    if (!updatedCoffinForm) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Coffin form not created!');
    }
    res.send({
        code: HttpStatusCodes.OK,
        message: HttpResponseMessages.OK,
        data: updatedCoffinForm
    });
});
 
const getCoffinFormById = catchAsync(async (req, res) => {
    const coffinForm = await coffinFormService.getCoffinFormById(req.body.id);
    if (!coffinForm) {
        throw new ApiError(httpStatus.NOT_FOUND, "Coffin Form not found");
    }
    res.send({
        code: HttpStatusCodes.OK,
        message: HttpResponseMessages.OK,
        data: coffinForm,
    });
});

const getCoffinForms = catchAsync(async (req, res) => {
    const obj = {};
    const filter = obj;
    const searchQuery = req.body.filter.searchQuery ? req.body.filter.searchQuery : '';
    const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
    const result = await coffinFormService.getCoffinForms(filter, options, searchQuery);
    res.send({
      code: HttpStatusCodes.OK,
      message: HttpResponseMessages.OK,
      data: result
    });
});

const deleteCoffinFormById = catchAsync(async (req, res) => {
    const coffinForm = await coffinFormService.deleteCoffinFormById(req.body.id, req.body, req.user.id);
    res.send({
        code: HttpStatusCodes.OK,
        message: HttpResponseMessages.OK,
        data: coffinForm,
    });
});


module.exports = {
    createCoffinForm,
    updateCoffinForm,
    getCoffinFormById,
    getCoffinForms,
    deleteCoffinFormById
};