const httpStatus = require("http-status");
const pick = require("../../../../utils/pick");
const ApiError = require("../../../../utils/ApiError");
const catchAsync = require("../../../../utils/catchAsync");
const { itemService } = require("../../../../services");
const {
  HttpStatusCodes,
  HttpResponseMessages,
} = require("../../../../utils/constants");

const createItem = catchAsync(async (req, res) => {
  // console.log("reqested User", req.user.id);
  const item = await itemService.createItem(req, req.body);
  res.status(httpStatus.CREATED).send({
    code: HttpStatusCodes.CREATED,
    message: HttpResponseMessages.CREATED,
    data: item,
  });
});

const getItems = catchAsync(async (req, res) => {
  const obj = {};
  const filter = obj;
  const options = pick(req.body, ["sortBy", "limit", "page"]);
  const result = await itemService.queryItems(filter, options);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: result,
  });
});

const getItem = catchAsync(async (req, res) => {
  const item = await itemService.getItemById(req.body.id);
  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, "Item not found");
  }
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: item,
  });
});

const updateItem = catchAsync(async (req, res) => {
  const item = await itemService.updateItemById(req.body.id, req.body, req.user.id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: item,
  });
});

const deleteItem = catchAsync(async (req, res) => {
  const item = await itemService.deleteItemById(req.body.id);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: item,
  });
});

module.exports = {
  createItem,
  getItems,
  getItem,
  updateItem,
  deleteItem,
};
