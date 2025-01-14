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

module.exports = {
  downloadTemplate,
};
