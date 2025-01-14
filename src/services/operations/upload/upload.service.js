const fs = require('fs');
const path = require('path');

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

module.exports = {
  downloadTemplate
};
