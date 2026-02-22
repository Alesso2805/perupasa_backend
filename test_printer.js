try {
  const PdfPrinter = require('pdfmake/js/Printer').default || require('pdfmake/js/Printer');
  console.log('Require Printer:', PdfPrinter);
  try {
    const printer = new PdfPrinter({ Roboto: { normal: 'fonts/Roboto-Regular.ttf' } });
    console.log('Constructor success');
  } catch (e) {
    console.log('Constructor failed:', e.message);
  }
} catch (e) {
  console.log('Require failed:', e.message);
}
