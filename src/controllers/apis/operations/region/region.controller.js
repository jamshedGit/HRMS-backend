const httpStatus = require("http-status");
const pick = require("../../../../utils/pick");
const ApiError = require("../../../../utils/ApiError");
const catchAsync = require("../../../../utils/catchAsync");
const RegionformService = require("../../../../services/index");


const {
    HttpStatusCodes,
    HttpResponseMessages,
} = require("../../../../utils/constants");

const createRegion = catchAsync(async (req, res) => {
    // console.log("reqested User", req.user.id);
    try {

        console.log("insert region")
        console.log(req.body);
        const Region = await RegionformService.regionFormService.createRegion(req, req.body);

        res.status(httpStatus.CREATED).send({
            code: HttpStatusCodes.CREATED,
            message: HttpResponseMessages.CREATED,
            data: Region
        });

    } catch (error) {
        console.log(error);
    }
});

const getAllRegion = catchAsync(async (req, res) => {
    console.log("get Region");
    const obj = {};
    const filter = obj;
    // const options = pick(req.body, ["sortBy", "limit", "page"]);
    const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
    const searchQuery = req.body.filter.searchQuery ? req.body.filter.searchQuery : '';
    const result = await RegionformService.regionFormService.queryRegion(filter, options, searchQuery);
    console.log(result);
    res.send({
        code: HttpStatusCodes.OK,
        message: HttpResponseMessages.OK,
        data: result,
    });
});

const getRegionById = catchAsync(async (req, res) => {
    console.log("Region Controller getRegionId")
    console.log(req.body)
    const Receipt = await RegionformService.regionFormService.getRegionById(req.body.Id);
    if (!Receipt) {
        throw new ApiError(httpStatus.NOT_FOUND, "Receipt not found");
    }
    res.send({
        code: HttpStatusCodes.OK,
        message: HttpResponseMessages.OK,
        data: Receipt,
    });
});

const updateRegion = catchAsync(async (req, res) => {
    console.log(req.body);
    const Receipt = await RegionformService.regionFormService.updateRegionById(req.body.Id, req.body, req.user.Id);
    res.send({
        code: HttpStatusCodes.OK,
        message: HttpResponseMessages.OK,
        data: Receipt,
    });
});

const deleteRegion = catchAsync(async (req, res) => {
    console.log("req.body.Id ", req.body.Id)
    const Receipt = await RegionformService.regionFormService.deleteRegionById(req.body.Id);
    res.send({
        code: HttpStatusCodes.OK,
        message: HttpResponseMessages.OK,
        data: Receipt,
    });
});


module.exports = {
    createRegion,
    getAllRegion,
    getRegionById,
    updateRegion,
    deleteRegion
};
