const PDFDocument = require('pdfkit');
const { PassThrough } = require('stream');

const generatePDF = async (filename, content) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const bufferStream = new PassThrough();
    const buffers = [];

    // Collect chunks of the buffer
    bufferStream.on('data', (chunk) => buffers.push(chunk));
    bufferStream.on('end', () => resolve(Buffer.concat(buffers)));
    bufferStream.on('error', reject);

    doc.pipe(bufferStream);

    // Add a title
    doc.fontSize(18).text('Project Information', { align: 'center' });
    doc.moveDown();

    // Add summary statement
    doc.fontSize(12).text('We are going to publish the project. Below is the information:');
    doc.moveDown();
    // console.log(content['Description']);
    // Add table
    doc.fontSize(12);
   
    doc.fontSize(12).font('Helvetica-Bold').text('Project Name:', { continued: true });
    doc.font('Helvetica').text(` ${content['Project_Name']}`);
    doc.font('Helvetica-Bold').text('Description:', { continued: true });
    doc.font('Helvetica').text(` ${content['Description']}`);
    doc.font('Helvetica-Bold').text('Assigned Manager:', { continued: true });
    doc.font('Helvetica').text(` ${content['Assigned_Manager']}`);
    doc.font('Helvetica-Bold').text('Milestones:', { continued: true });
    doc.font('Helvetica').text(` ${content['Milestones']}`);
    doc.font('Helvetica-Bold').text('Start Date:', { continued: true });
    doc.font('Helvetica').text(` ${content['Start_Date']}`);
    doc.font('Helvetica-Bold').text('End Date:', { continued: true });
    doc.font('Helvetica').text(` ${content['End_Date']}`);   
    doc.end();
  });
};

// Utility function to add a table
PDFDocument.prototype.table = function (data, options) {
  const { columnsSize = [200, 400], padding = 10, border = { width: 1, color: '#000000' } } = options || {};
  const tableTop = this.y;

  data.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      this.rect(this.x, tableTop + (rowIndex * 20), columnsSize[cellIndex], 20)
        .strokeColor(border.color)
        .stroke();
      this.text(cell, this.x + padding, tableTop + (rowIndex * 20) + padding, { width: columnsSize[cellIndex] - (padding * 2) });
    });
  });

  this.y += data.length * 20;
  return this;
};

module.exports = { generatePDF };
