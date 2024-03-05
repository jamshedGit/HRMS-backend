const httpStatus = require('http-status');
const pick = require('../../../utils/pick');
const ApiError = require('../../../utils/ApiError');
const catchAsync = require('../../../utils/catchAsync');
const { resourceService } = require('../../../services');
const { HttpStatusCodes, HttpResponseMessages } = require('../../../utils/constants');

const createResource = catchAsync(async (req, res) => {

    // console.log("reqested User",req.user.id);
  const Resource = await resourceService.createResource(req, req.body);
  res.status(httpStatus.CREATED).send({
    code: HttpStatusCodes.CREATED,
    message: HttpResponseMessages.CREATED,
    data: Resource,
  });
});

const getResources = catchAsync(async (req, res) => {
  const obj = {};
  const filter = obj;
  const options = pick(req.body, ['sortBy', 'limit', 'page']);
  const result = await resourceService.queryResources(filter, options);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result,
  });
});

const getResource = catchAsync(async (req, res) => {
  const Resource = await resourceService.getResourceById(req.body.id);
  if (!Resource) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Resource not found');
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Resource,
  });
});

const updateResource = catchAsync(async (req, res) => {
  const Resource = await resourceService.updateResourceById(req.body.id, req.body);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Resource,
  });
});

const deleteResource = catchAsync(async (req, res) => {
  const Resource = await resourceService.deleteResourceById(req.body.id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: Resource,
  });
});

module.exports = {
  createResource,
  getResources,
  getResource,
  updateResource,
  deleteResource,
};
