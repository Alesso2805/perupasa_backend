import { Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const PdfPrinter = require('pdfmake/js/Printer').default;
import { GuiaVenta } from '../entities/guia-venta.entity';
import * as fs from 'fs';

@Injectable()
export class PdfService {
  private printer: any;

  constructor() {
    const path = require('path');
    const fonts = {
      Roboto: {
        normal: path.join(process.cwd(), 'fonts', 'Roboto-Regular.ttf'),
        bold: path.join(process.cwd(), 'fonts', 'Roboto-Medium.ttf'),
        italics: path.join(process.cwd(), 'fonts', 'Roboto-Italic.ttf'),
        bolditalics: path.join(process.cwd(), 'fonts', 'Roboto-MediumItalic.ttf'),
      },
    };
    this.printer = new PdfPrinter(fonts);
  }

  /*
   * Generates a PDF buffer for a given GuiaVenta
   */
  async generateGuiaPdf(guia: GuiaVenta): Promise<Buffer> {
    // Format date in spanish
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const dateFormatted = guia.fecha.toLocaleDateString('es-PE', options);
    
    // Format guide number
    const formattedNumber = `001-${guia.numero_guia.toString().padStart(6, '0')}`;

    const docDefinition: any = {
      pageSize: 'A4',
      pageMargins: [40, 50, 40, 50],
      defaultStyle: {
        font: 'Roboto'
      },
      content: [
        {
          columns: [
            {
              width: '*',
              stack: [
                { text: 'GUÍA DE REMISIÓN', style: 'title' },
                { text: 'PERUPASATEX S.A.C.', style: 'companyName' }
              ]
            },
            {
              width: 'auto',
              stack: [
                { text: 'FECHA DE EMISIÓN', style: 'headerLabel' },
                { text: dateFormatted, style: 'headerValue' },
                { text: 'N° GUÍA', style: 'headerLabel', margin: [0, 8, 0, 0] },
                { text: formattedNumber, style: 'headerValue' },
              ],
              alignment: 'right'
            }
          ]
        },
        {
          canvas: [{ type: 'line', x1: 0, y1: 15, x2: 515, y2: 15, lineWidth: 2, lineColor: '#111827' }]
        },
        { text: '\n\n' },
        {
          table: {
            headerRows: 1,
            widths: ['15%', '*', '10%', '8%', '10%', '13%', '14%'],
            body: [
              [
                { text: 'CÓDIGO', style: 'tableHeader' },
                { text: 'DESCRIPCIÓN', style: 'tableHeader' },
                { text: 'COLOR', style: 'tableHeader' },
                { text: 'CANT.', style: 'tableHeader' },
                { text: 'UNID.', style: 'tableHeader' },
                { text: 'P. UNIT.', style: 'tableHeader', color: '#9ca3af' },
                { text: 'TOTAL', style: 'tableHeader' },
              ],
              ...guia.detalles.map((d) => [
                { text: d.producto?.codigo_articulo || '-', style: 'tableRowMono' },
                { text: d.producto?.nombre || '-', style: 'tableRowDesc' },
                { text: d.colores?.map(c => c.color?.numero_color ?? '-').join(', ') || '-', style: 'tableRow' },
                { text: d.cantidad?.toString() || '0', style: 'tableRowBold' },
                { text: (d.unidad || 'PIEZAS').toUpperCase(), style: 'tableRowGray' },
                { text: `S/ ${Number(d.precio_unitario || 0).toFixed(2)}`, style: 'tableRowPrice' },
                { text: `S/ ${Number(d.subtotal || 0).toFixed(2)}`, style: 'tableRowTotal' }
              ]),
              [
                { text: 'TOTAL GENERAL', style: 'footerLabel', colSpan: 6 }, 
                {}, {}, {}, {}, {}, 
                { text: `S/ ${Number(guia.total_final).toFixed(2)}`, style: 'footerTotal' }
              ],
            ],
          },
          layout: {
            hLineWidth: function (i: number, node: any) {
              if (i === 1) return 1; // Under header
              if (i === node.table.body.length - 1 && node.table.body.length > 2) return 2; // Before Total General
              return 0; // Between items
            },
            vLineWidth: function () {
              return 0; // No vertical lines
            },
            hLineColor: function () {
              return '#111827';
            },
            paddingTop: function () { return 10; },
            paddingBottom: function () { return 10; }
          }
        },
        { text: '\n\n\n\n' },
        { text: 'DOCUMENTO GENERADO DIGITALMENTE', style: 'footerText' }
      ],
      styles: {
        title: { fontSize: 22, bold: true, color: '#111827', characterSpacing: 2 },
        companyName: { fontSize: 11, color: '#4b5563', margin: [0, 4, 0, 0] },
        headerLabel: { fontSize: 9, bold: true, color: '#6b7280', characterSpacing: 1 },
        headerValue: { fontSize: 11, bold: true, color: '#111827', margin: [0, 2, 0, 0] },
        tableHeader: { fontSize: 10, bold: true, color: '#111827', characterSpacing: 1, alignment: 'center' },
        tableRow: { fontSize: 9, color: '#111827', alignment: 'center' },
        tableRowMono: { fontSize: 9, color: '#111827', alignment: 'center' }, // Would use mono if available
        tableRowDesc: { fontSize: 9, color: '#374151', alignment: 'center' },
        tableRowBold: { fontSize: 9, color: '#111827', bold: true, alignment: 'center' },
        tableRowGray: { fontSize: 9, color: '#6b7280', alignment: 'center' },
        tableRowPrice: { fontSize: 9, color: '#9ca3af', alignment: 'center' },
        tableRowTotal: { fontSize: 9, color: '#111827', bold: true, alignment: 'center' },
        footerLabel: { fontSize: 11, bold: true, color: '#4b5563', characterSpacing: 1, alignment: 'right', margin: [0, 4, 10, 0] },
        footerTotal: { fontSize: 14, bold: true, color: '#4f46e5', alignment: 'center', margin: [0, 2, 0, 0] },
        footerText: { fontSize: 9, color: '#9ca3af', characterSpacing: 1, alignment: 'center' }
      },
    };

    return new Promise(async (resolve, reject) => {
      try {
        const pdfDoc = await this.printer.createPdfKitDocument(docDefinition);
        const chunks: Buffer[] = [];
        
        pdfDoc.on('data', (chunk) => chunks.push(chunk));
        pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
        pdfDoc.on('error', (err) => reject(err));
        
        pdfDoc.end();
      } catch (err) {
        fs.appendFileSync('pdf_error.txt', `[${new Date().toISOString()}] Error: ${err.message}\nStack: ${err.stack}\n`);
        reject(err);
      }
    });
  }
}
