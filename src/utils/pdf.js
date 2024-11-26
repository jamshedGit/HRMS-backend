const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');
const pdf = require('html-pdf-node');
const templatePath = path.join(__dirname + '/../docs/pdf_templates/')


/**
 * Generates a PDF from a Handlebars template and returns it as a buffer.
 * @param {string} templatePath - Path to the Handlebars template file.
 * @param {object} data - Data to populate the template.
 * @returns {Promise<Buffer>} - Resolves to a buffer containing the PDF content.
 */
async function generatePdf(fileName, data) {
  try {
    // Read the template file
    const templateSource = fs.readFileSync(templatePath + fileName, 'utf-8');
    const template = Handlebars.compile(templateSource);

    // Generate HTML content from the template
    const htmlContent = template(data);

    const file = { content: htmlContent };

    // Return the PDF as a buffer
    return new Promise((resolve) => {
      pdf.generatePdf(file, { })
        .then((pdfBuffer) => resolve(pdfBuffer))
        .catch((error) => reject(error));
    });


  } catch (err) {
    console.error('Error generating PDF:', err);
    throw err;
  }
}

module.exports = generatePdf;