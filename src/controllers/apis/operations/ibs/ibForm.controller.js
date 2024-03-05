const httpStatus = require("http-status");
const pick = require("../../../../utils/pick");
const ApiError = require("../../../../utils/ApiError");
const catchAsync = require("../../../../utils/catchAsync");
const { ibFormService } = require("../../../../services");
const {
    HttpStatusCodes,
    HttpResponseMessages,
} = require("../../../../utils/constants");

const createIbForm = async (req, res) => {
    const data = req.body; 
    const sanitizedData = Object.entries(data).reduce((acc, [key, value]) => 
    { acc[key] = value ?? null; return acc; }, {});
    const ibFormCreated = await ibFormService.createIbForm(req, sanitizedData);
    // console.log("Latest created Id",ibFormCreated.id)
    if (!ibFormCreated) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Ib form not created something went wrong!');
    }
    res.send({
        code: HttpStatusCodes.OK,
        message: HttpResponseMessages.OK,
        data: ibFormCreated
    });
};

const updateIbForm = catchAsync(async (req, res) => {
    const data = req.body; 
    // const sanitizedData = Object.entries(data).reduce((acc, [key, value]) => 
    // { acc[key] = value ?? null; return acc; }, {});
    // res.send({
    //     code: HttpStatusCodes.OK,
    //     message: HttpResponseMessages.OK,
    //     data: data
    // });
    const updatedIbForm = await ibFormService.updateIbForm(req, data);
    if (!updatedIbForm) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Ib form not created!');
    }
    res.send({
        code: HttpStatusCodes.OK,
        message: HttpResponseMessages.OK,
        data: updatedIbForm
    });
});
 
const getIbForm = catchAsync(async (req, res) => {
    const ibForm = await ibFormService.getIbFormById(req.body.id);
    if (!ibForm) {
        throw new ApiError(httpStatus.NOT_FOUND, "Ib Form not found");
    }
    res.send({
        code: HttpStatusCodes.OK,
        message: HttpResponseMessages.OK,
        data: ibForm,
    });
});

const getIbForms = catchAsync(async (req, res) => {
    const obj = {};
    const filter = obj;
    const searchQuery = req.body.filter.searchQuery ? req.body.filter.searchQuery : '';
    const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
    const result = await ibFormService.getIbForms(filter, options, searchQuery);
    res.send({
      code: HttpStatusCodes.OK,
      message: HttpResponseMessages.OK,
      data: result
    });
});

const deleteIbFormById = catchAsync(async (req, res) => {
    const incidentDetail = await ibFormService.deleteIbFormById(req.body.id, req.body, req.user.id);
    res.send({
        code: HttpStatusCodes.OK,
        message: HttpResponseMessages.OK,
        data: incidentDetail,
    });
});

const getIbsReportByYear = catchAsync(async (req, res) => {
    const ibsReport = await ibFormService.getIbsReportByYear(req.body.year);
    if (!ibsReport) {
        throw new ApiError(httpStatus.NOT_FOUND, "Ib Report not found");
    }
    res.send({
        code: HttpStatusCodes.OK,
        message: HttpResponseMessages.OK,
        data: ibsReport,
    });
});
module.exports = {
    createIbForm,
    updateIbForm,
    getIbForm,
    getIbForms,
    deleteIbFormById,
    getIbsReportByYear
};