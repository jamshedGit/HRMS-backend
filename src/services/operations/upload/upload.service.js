const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');
const { getExcelSheetData } = require('../../../utils/xslx');

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

const saveLeaveData = async (req) => {
  const file = req.file
  const data = await getExcelSheetData(file.buffer)
  console.log(':::data::::::', data);
  return ''
}

module.exports = {
  downloadTemplate,
  saveLeaveData
};
