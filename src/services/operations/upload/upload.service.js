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
      const groupedData = formatExcelData(data.Sheet1, keys);
      await leaveSheetValidation(groupedData);

      for (const al of groupedData) {
        if (al.employee && al.currentEmployeeYear && al.currentEmployeeLeaveType) {
          const init = initialValues;
          Object.assign(init, {
            employeeId: al.employee.Id,
            leaveType: al.currentEmployeeLeaveType.Id,
            yearId: al.currentEmployeeYear.Id,
            allocatedCount: Number(al['Leave Balance'])
          });

          await EmployeeLeaveBalanceModel.create(init)
        }
      }
      return ''
    }
    else {
      throw new ApiError(httpStatus.BAD_REQUEST, 'No Data Found in the File');
    }
  }
  else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'File not found or incorrectly uploaded');
  }
}

const leaveSheetValidation = async (sheetData) => {
  let index = 2;
  for (const sd of sheetData) {

    if(!sd['Employee Code']){
      throw new ApiError(httpStatus.BAD_REQUEST, `Sheet Data Not Entered Correct. Error Found on Employee Code: ${sd['Employee Code'] || ''} on Row: ${index}`);
    }
    
    const employee = await EmployeeProfileModel.findOne({
      where: {
        employeeCode: sd['Employee Code'],
        isActive: true
      },
      attributes: ['Id', 'employeeCode', 'subsidiaryId']
    })

    if (!employee) {
      throw new ApiError(httpStatus.BAD_REQUEST, `Sheet Data Not Entered Correct. Error Found on Employee Code: ${sd['Employee Code']} on Row: ${index}`);
    }

    sd.employee = employee;

    if(!sd['Balance Cut-off Date']){
      throw new ApiError(httpStatus.BAD_REQUEST, `Sheet Data Not Entered Correct. Error Found on Balance Cut-off Date: ${sd['Balance Cut-off Date'] || ''} on Row: ${index}`);
    }

    const currentEmployeeYear = await FiscalSetupModel.findOne({
      where: {
        startDate: { [Op.lte]: new Date(sd['Balance Cut-off Date']) },
        endDate: { [Op.gte]: new Date(sd['Balance Cut-off Date']) },
        subsidiaryId: employee.subsidiaryId,
        isActive: true
      },
      attributes: ['Id']
    });

    if (!currentEmployeeYear) {
      throw new ApiError(httpStatus.BAD_REQUEST, `Sheet Data Not Entered Correct. Error Found on Balance Cut-off Date: ${sd['Balance Cut-off Date']} on Row: ${index}`);
    }
    sd.currentEmployeeYear = currentEmployeeYear;

    if(!sd['Leave Type']){
      throw new ApiError(httpStatus.BAD_REQUEST, `Sheet Data Not Entered Correct. Error Found on Leave Type: ${sd['Leave Type'] || ''} on Row: ${index}`);
    }

    const currentEmployeeLeaveType = await LeaveTypeModel.findOne({
      where: { code: sd['Leave Type'] },
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

    if (!currentEmployeeLeaveType) {
      throw new ApiError(httpStatus.BAD_REQUEST, `Sheet Data Not Entered Correct. Error Found on Leave Type: ${sd['Leave Type']} on Row: ${index}`);
    }
    sd.currentEmployeeLeaveType = currentEmployeeLeaveType;

    const currentEmployeeLeaveBalance = await EmployeeLeaveBalanceModel.findOne({
      where: {
        employeeId: employee.Id,
        leaveType: currentEmployeeLeaveType.Id,
        yearId: currentEmployeeYear.Id
      }
    });

    if (currentEmployeeLeaveBalance) {
      throw new ApiError(httpStatus.BAD_REQUEST, `Sheet Data Not Entered Correct. Balance already present for Employee Code: ${sd['Employee Code']} on Row: ${index}`);
    }

    if(!sd['Leave Balance']){
      throw new ApiError(httpStatus.BAD_REQUEST, `Sheet Data Not Entered Correct. Error Found on Leave balance: ${sd['Leave Balance'] || ''} on Row: ${index}`);
    }

    if(Number(sd['Leave Balance']) > 999 || Number(sd['Leave Balance']) < 1){
      throw new ApiError(httpStatus.BAD_REQUEST, `Sheet Data Not Entered Correct. Please Enter Valid Leave Balance for Employee Code: ${sd['Employee Code']} on Row: ${index}`);
    }

    index++;
  }
}

module.exports = {
  downloadTemplate,
  saveLeaveData
};
