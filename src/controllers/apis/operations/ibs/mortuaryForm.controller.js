const httpStatus = require("http-status");
const pick = require("../../../../utils/pick");
const ApiError = require("../../../../utils/ApiError");
const catchAsync = require("../../../../utils/catchAsync");
const { mortuaryFormService } = require("../../../../services");
const {
    HttpStatusCodes,
    HttpResponseMessages,
} = require("../../../../utils/constants");

const createMortuaryForm = async (req, res) => {
    const data = req.body; 
    const sanitizedData = Object.entries(data).reduce((acc, [key, value]) => 
    { acc[key] = value ?? null; return acc; }, {});
    const mortuaryFormCreated = await mortuaryFormService.createMortuaryForm(req, sanitizedData);
    // console.log("Latest created Id",mortuaryFormCreated.id)
    if (!mortuaryFormCreated) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Mortuary form not created something went wrong!');
    }
    res.send({
        code: HttpStatusCodes.OK,
        message: HttpResponseMessages.OK,
        data: mortuaryFormCreated
    });
};

const updateMortuaryForm = catchAsync(async (req, res) => {
    const data = req.body; 
    // const sanitizedData = Object.entries(data).reduce((acc, [key, value]) => 
    // { acc[key] = value ?? null; return acc; }, {});
    // res.send({
    //     code: HttpStatusCodes.OK,
    //     message: HttpResponseMessages.OK,
    //     data: data
    // });
    const updatedMortuaryForm = await mortuaryFormService.updateMortuaryForm(req, data);
    if (!updatedMortuaryForm) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Mortuary form not created!');
    }
    res.send({
        code: HttpStatusCodes.OK,
        message: HttpResponseMessages.OK,
        data: updatedMortuaryForm
    });
});
 
const getMortuaryFormById = catchAsync(async (req, res) => {
    const mortuaryForm = await mortuaryFormService.getMortuaryFormById(req.body.id);
    if (!mortuaryForm) {
        throw new ApiError(httpStatus.NOT_FOUND, "Mortuary Form not found");
    }
    res.send({
        code: HttpStatusCodes.OK,
        message: HttpResponseMessages.OK,
        data: mortuaryForm,
    });
});

const getMortuaryForms = catchAsync(async (req, res) => {
    const obj = {};
    const filter = obj;
    const searchQuery = req.body.filter.searchQuery ? req.body.filter.searchQuery : '';
    const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
    const result = await mortuaryFormService.getMortuaryForms(filter, options, searchQuery);
    res.send({
      code: HttpStatusCodes.OK,
      message: HttpResponseMessages.OK,
      data: result
    });
});

const deleteMortuaryFormById = catchAsync(async (req, res) => {
    const mortuaryForm = await mortuaryFormService.deleteMortuaryFormById(req.body.id, req.body, req.user.id);
    res.send({
        code: HttpStatusCodes.OK,
        message: HttpResponseMessages.OK,
        data: mortuaryForm,
    });
});


module.exports = {
    createMortuaryForm,
    updateMortuaryForm,
    getMortuaryFormById,
    getMortuaryForms,
    deleteMortuaryFormById
};