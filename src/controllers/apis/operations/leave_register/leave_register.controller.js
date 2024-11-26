const catchAsync = require("../../../../utils/catchAsync");
const { LeaveRegisterServicePage } = require("../../../../services/index");
const {
  HttpStatusCodes,
  HttpResponseMessages,
} = require("../../../../utils/constants");

/**
 * 
 * Get All Registered Leave Application with Pagination
 * 
 * @param {Object} req 
 * @returns res
 */
const getAllRegisteredLeaves = catchAsync(async (req, res) => {
  const data = await LeaveRegisterServicePage.getAllRegisteredLeaves(req);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: data
  });
});

/**
 * 
 * Get All Registered Leave Application for Pdf
 * 
 * @param {Object} req 
 * @returns res
 */
const getAllRegisteredLeavesPdfData = catchAsync(async (req, res) => {
  const data = await LeaveRegisterServicePage.getAllRegisteredLeavesForPdf(req);
  res.set({
    "Content-Type": "application/pdf",
    "Content-Disposition": 'attachment; filename="kamil_test.pdf"',
  });
  res.end(data);
});

module.exports = {
  getAllRegisteredLeaves,
  getAllRegisteredLeavesPdfData
};
