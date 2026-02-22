try {
  const PdfPrinter = require('pdfmake');
  console.log('Require pdfmake:', PdfPrinter);
  console.log('Type:', typeof PdfPrinter);
  try {
    new PdfPrinter({});
    console.log('Constructor success');
  } catch (e) {
    console.log('Constructor failed:', e.message);
  }
} catch (e) {
  console.log('Require failed:', e.message);
}
