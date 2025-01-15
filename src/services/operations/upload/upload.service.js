const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const { getExcelSheetData } = require('../../../utils/xslx');
const { formatExcelData } = require('../../../utils/common');
const { FiscalSetupModel, EmployeeProfileModel, EmployeeLeaveBalanceModel, LeaveTypeModel, LeaveTypeModelAccess } = require('../../../models');
const ApiError = require("../../../utils/ApiError");
const httpStatus = require('http-status');

const Op = Sequelize.Op;

const initialValues = {
  employeeId: '',
  leaveType: '',
  yearId: '',
  allocatedCount: 0,
  availedCount: 0,
  remainingCount: 0,
  carryForwardCount: 0,
  lateCount: 0,
  encashmentCount: 0,
}

/**
 * 
 * Download Template Excel
 * 
 * @param {Object} req 
 * @returns 
 */
const downloadTemplate = async (req, res) => {
  const type = req.body.type;
  const filePath = path.join(__dirname, '../../../docs/excel_templates/', type + '.xlsx');
  const data = await fs.readFileSync(filePath);
  return data
}

/**
 * 
 * Save Leave Data from Excel Uploaded
 * 
 * @param {Object} req 
 * @returns 
 */
const saveLeaveData = async (req) => {
  const file = req.file
  if (file) {
    const data = await getExcelSheetData(file?.buffer)
    if (data?.Sheet1?.length > 1) {
      const keys = data.Sheet1[0].slice(1);
      const groupedData = formatExcelData(data.Sheet1, keys)
      const employeeData = await EmployeeProfileModel.findAll({
        where: {
          employeeCode: groupedData.map(el => el['Employee Code'])
        },
        attributes: ['Id', 'employeeCode', 'subsidiaryId']
      });

      for (const al of groupedData) {
        const employee = employeeData.find((el => el.employeeCode == al['Employee Code']))
        if (employee) {
          const currentEmployeeYear = await FiscalSetupModel.findOne({
            where: {
              startDate: { [Op.lte]: new Date(al['Balance Cut-off Date']) },
              endDate: { [Op.gte]: new Date(al['Balance Cut-off Date']) },
              subsidiaryId: employee.subsidiaryId
            },
            attributes: ['Id']
          });

          const currentEmployeeLeaveType = await LeaveTypeModel.findOne({
            where: { code: al['Leave Type'] },
            include: [
              {
                model: LeaveTypeModelAccess,
                where: { subsidiaryId: employee.subsidiaryId },
                required: true,
                attributes: []
              }
            ],
            attributes: ['Id']
          });

          if (currentEmployeeYear && currentEmployeeLeaveType) {
            const currentEmployeeLeaveBalance = await EmployeeLeaveBalanceModel.findOne({
              where: {
                employeeId: employee.Id,
                leaveType: currentEmployeeLeaveType.Id,
                yearId: currentEmployeeYear.Id
              }
            });

            if (currentEmployeeLeaveBalance) {
              currentEmployeeLeaveBalance.allocatedCount = Number(al['Leave Balance'])
              currentEmployeeLeaveBalance.remainingCount = currentEmployeeLeaveBalance.allocatedCount - Number(currentEmployeeLeaveBalance.availedCount || 0);
              currentEmployeeLeaveBalance.remainingCount -= Number(currentEmployeeLeaveBalance.encashmentCount || 0)
              currentEmployeeLeaveBalance.remainingCount += Number(currentEmployeeLeaveBalance.carryForwardCount || 0)

              if (currentEmployeeLeaveBalance.remainingCount < 0) {
                currentEmployeeLeaveBalance.remainingCount = 0
              }
              currentEmployeeLeaveBalance.save()
            }
            else {
              const init = initialValues;
              Object.assign(init, {
                employeeId: employee.Id,
                leaveType: currentEmployeeLeaveType.Id,
                yearId: currentEmployeeYear.Id,
                allocatedCount: Number(al['Leave Balance'])
              });


              await EmployeeLeaveBalanceModel.create(init)
            }
          }
        }
      }
      return ''
    }
    else{
      throw new ApiError(httpStatus.BAD_REQUEST, 'No Data Found in the File');
    }
  }
  else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'File not found or incorrectly uploaded');
  }
}

module.exports = {
  downloadTemplate,
  saveLeaveData
};
