const catchAsync = require("../../../../utils/catchAsync");
const { EmployeeRegisterServicePage } = require("../../../../services/index");
const {
  HttpStatusCodes,
  HttpResponseMessages,
} = require("../../../../utils/constants");

/**
 * 

 * 
 * @param {Object} req 
 * @returns res
 */
const getAllRegisteredEmployees = catchAsync(async (req, res) => {
  const data = await EmployeeRegisterServicePage.getAllRegisteredEmployees(req);
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: data
  });
});

/**
 * 

 * 
 * @param {Object} req 
 * @returns res
 */
const getAllRegisteredEmployeesPdfData = catchAsync(async (req, res) => {
  console.log("pff111")
  const data = await EmployeeRegisterServicePage.getAllRegisteredEmployeesForPdf(req);
  res.set({
    "Content-Type": "application/pdf",
    "Content-Disposition": 'attachment; filename="payroll_register.pdf"',
  });
  res.end(data);
});

module.exports = {
    getAllRegisteredEmployees,
  getAllRegisteredEmployeesPdfData
};
