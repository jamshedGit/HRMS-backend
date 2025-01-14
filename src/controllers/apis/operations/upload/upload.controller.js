const catchAsync = require("../../../../utils/catchAsync");
const { UploadServicePage } = require("../../../../services/index");
const {
  HttpStatusCodes,
  HttpResponseMessages,
} = require("../../../../utils/constants");

/**
 * 
 * Download 
 * 
 * @param {Object} req 
 * @returns res
 */
const downloadTemplate = catchAsync(async (req, res) => {
  const data = await UploadServicePage.downloadTemplate(req, res);
  res.set({
    "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "Content-Disposition": 'attachment; filename="template.xlsx"',
  });
  res.end(data);
});

const saveLeaveData = catchAsync(async (req, res) => {
  console.log('::::AYAA::::');
  
  const data = await UploadServicePage.saveLeaveData(req);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: data,
  });
});

module.exports = {
  downloadTemplate,
  saveLeaveData
};
