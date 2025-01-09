const ExcelJS = require('exceljs');

/**
 * Generates an Excel file from the provided data and returns it as a buffer.
 * @param {string} fileName - Name of the Excel file to be generated.
 * @param {Array} data - Array of objects or arrays representing the data to populate the Excel sheet.
 * @param {Array} [columns] - Optional array of column headers and keys.
 * @returns {Promise<Buffer>} - Resolves to a buffer containing the Excel file.
 */
async function generateExcel(workbook) {
  try {
    const buffer = await workbook.xlsx.writeBuffer();
    console.log('Excel file generated successfully!');
    return buffer;
  } catch (err) {
    console.error('Error generating Excel:', err);
    throw err;
  }
}

async function createExcelSheet(fileName) {
  
  // Create a new workbook and worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(fileName || 'Sheet');

  return { workbook, worksheet }
}

module.exports = { createExcelSheet, generateExcel };