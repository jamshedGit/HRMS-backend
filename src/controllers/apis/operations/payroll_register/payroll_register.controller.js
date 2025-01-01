const catchAsync = require("../../../../utils/catchAsync");
const { PayrollRegisterServicePage } = require("../../../../services/index");
const {
  HttpStatusCodes,
  HttpResponseMessages,
} = require("../../../../utils/constants");

/**
 * 
 * Get All Payroll with Pagination
 * 
 * @param {Object} req 
 * @returns res
 */
const getAllRegisteredPayroll = catchAsync(async (req, res) => {
  const data = await PayrollRegisterServicePage.getAllRegisteredPayroll(req);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: data
  });
});

/**
 * 
 * Get All Payroll for Pdf
 * 
 * @param {Object} req 
 * @returns res
 */
const generatePayslip = catchAsync(async (req, res) => {
  const data = await PayrollRegisterServicePage.generatePaySlip(req);
  res.set({
    "Content-Type": "application/pdf",
    "Content-Disposition": 'attachment; filename="payslip.pdf"',
  });
  res.end(data);
});

module.exports = {
  getAllRegisteredPayroll,
  generatePayslip
};
