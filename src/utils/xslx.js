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

async function createHeader(worksheet, title, font = null, fill = null) {
  const header = worksheet.addRow(title);
  worksheet.addRow([]);

  const headerRow = worksheet.getRow(header._number);
  if (font) {
    headerRow.font = font;
  }
  if (fill) {
    headerRow.fill = fill;
  }
}

async function createFilters(worksheet, data, labelsArr, font = null, fill = null) {
  labelsArr.forEach(element => {
    if (data[element.label]) {
      const row = worksheet.addRow([element.message, data[element.label]]);
      const Row = worksheet.getRow(row._number);

      if (font) {
        Row.getCell(2).font = font;
      }
      if (fill) {
        Row.getCell(2).fill = fill;
      }
    }
  });
}

async function createTableHeader(worksheet, columns, font = null, fill = null) {
  const tableHeader = worksheet.addRow(columns.map((el) => el.header));

  const columnRow = worksheet.getRow(tableHeader._number);
  if (font) {
    columnRow.font = font;
  }
  if (fill) {
    columnRow.fill = fill;
  }
}

async function createGroupHeader(worksheet, header, font = null, fill = null) {
  const groupHeaderRow = worksheet.addRow(header)
  const groupByHeaderRow = worksheet.getRow(groupHeaderRow._number);

  if (font) {
    groupByHeaderRow.font = font;
  }
  if (fill) {
    groupByHeaderRow.fill = fill;
  }
}

async function createSubtotal(worksheet, data, font = null, fill = null) {
  const subtotal = worksheet.addRow(data)
  const subTotalRow = worksheet.getRow(subtotal._number);

  if (font) {
    subTotalRow.font = font;
  }
  if (fill) {
    subTotalRow.fill = fill;
  }
}



async function getExcelSheetData(buffer) {
  const workbook = new ExcelJS.Workbook();

  // Load the file from buffer
  await workbook.xlsx.load(buffer);
  workbook.properties.date1904 = true;

  const obj = {};

  let i = 1;
  while (true) {
    const worksheet = workbook.getWorksheet(i);

    if(!worksheet){
      break;
    }

    const data = [];
    worksheet.eachRow((row) => {
      data.push(row.values);
    });

    obj[worksheet._name] = data;
    i++
  }


  return obj
}

module.exports = { createExcelSheet, generateExcel, createHeader, createFilters, createTableHeader, createGroupHeader, createSubtotal, getExcelSheetData };