const httpStatus = require("http-status");
const pick = require("../../../../utils/pick");
const ApiError = require("../../../../utils/ApiError");
const catchAsync = require("../../../../utils/catchAsync");
const { subCenterService } = require("../../../../services");
const {
  HttpStatusCodes,
  HttpResponseMessages,
} = require("../../../../utils/constants");

// Helper function to check if a value is a floating-point number
function isFloat(value) {
  if (isNaN(value)) {
    return false;
  }
  const floatValue = parseFloat(value);
  return Number.isFinite(floatValue) && !Number.isInteger(floatValue);
}

const createSubCenter = catchAsync(async (req, res) => {
  // Validate the latitude and longitude values
  if(req.body.latitude) {
    // Validate the latitude and longitude values
    if (!isFloat(req.body.latitude)) {
      // If either value is not a floating-point number, send a 400 Bad Request error response
      throw new ApiError(httpStatus.BAD_REQUEST, "Latitude must be floating value.");
    }
  }
  if(req.body.longitude) {
    // Validate the latitude and longitude values
    if (!isFloat(req.body.longitude)) {
      // If either value is not a floating-point number, send a 400 Bad Request error response
      throw new ApiError(httpStatus.BAD_REQUEST, "Longitude must be floating value.");
    }
  }
  const subcenter = await subCenterService.createSubCenter(req, req.body);
  res.status(httpStatus.CREATED).send({
    code: HttpStatusCodes.CREATED,
    message: HttpResponseMessages.CREATED,
    data: subcenter,
  });
});

const getSubCenters = catchAsync(async (req, res) => {
  const obj = {};
  const filter = obj;
  const searchQuery = req.body.filter.searchQuery? req.body.filter.searchQuery : '';
  const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
  const result = await subCenterService.querySubCenters(filter, options, searchQuery);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result,
  });
});

const getSubCenter = catchAsync(async (req, res) => {
  const subcenter = await subCenterService.getSubCenterById(req.body.id);
  if (!subcenter) {
    throw new ApiError(httpStatus.NOT_FOUND, "SubCenter not found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: subcenter,
  });
});

const updateSubCenter = catchAsync(async (req, res) => {
  // Validate the latitude and longitude values
  if(req.body.latitude) {
    // Validate the latitude and longitude values
    if (!isFloat(req.body.latitude)) {
      // If either value is not a floating-point number, send a 400 Bad Request error response
      throw new ApiError(httpStatus.BAD_REQUEST, "Latitude must be floating value.");
    }
  }
  if(req.body.longitude) {
    // Validate the latitude and longitude values
    if (!isFloat(req.body.longitude)) {
      // If either value is not a floating-point number, send a 400 Bad Request error response
      throw new ApiError(httpStatus.BAD_REQUEST, "Longitude must be floating value.");
    }
  }
  const subcenter = await subCenterService.updateSubCenterById(req.body.id, req.body, req.user.id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: subcenter,
  });
});

const deleteSubCenter = catchAsync(async (req, res) => {
  const subcenter = await subCenterService.deleteSubCenterById(req.body.id, req.body, req.user.id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: subcenter,
  });
});

module.exports = {
  createSubCenter,
  getSubCenters,
  getSubCenter,
  updateSubCenter,
  deleteSubCenter,
};
