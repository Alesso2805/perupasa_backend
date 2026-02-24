import { Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const PdfPrinter = require('pdfmake/js/Printer').default;
import { GuiaVenta } from '../entities/guia-venta.entity';

@Injectable()
export class PdfService {
  private printer: any;

  constructor() {
const fonts = {
      Roboto: {
        normal: 'fonts/Roboto-Regular.ttf',
        bold: 'fonts/Roboto-Medium.ttf',
        italics: 'fonts/Roboto-Italic.ttf',
        bolditalics: 'fonts/Roboto-MediumItalic.ttf',
      },
    };
    // For server-side pdfmake, we usually need local fonts or standard fonts.
    // Using standard standard fonts to avoid filesystem issues for now, or just mock it.
    // Actually pdfmake server side needs local files usually.
    // Let's use standard fonts helper or just define Roboto if we have it.
    // For simplicity in this environment, I'll rely on default font handling or try to load from buffer if needed.
    // But standard way is passing font descriptors.
    // Let's assume we can use a basic setup.
    this.printer = new PdfPrinter(fonts);
  }

  /*
   * Generates a PDF buffer for a given GuiaVenta
   */
  async generateGuiaPdf(guia: GuiaVenta): Promise<Buffer> {
    const docDefinition = {
      content: [
        { text: 'GUÍA DE REMISIÓN', style: 'header' },
        { text: `N° Guía: ${guia.numero_guia}`, style: 'subheader' },
        { text: `Fecha: ${guia.fecha.toISOString().split('T')[0]}` },
        { text: `Cliente: ${guia.cliente_nombre}` },
        { text: `Tipo Precio: ${guia.es_copasa ? 'COPASA' : 'GENERAL'}` },
        { text: '\n' },
        {
          table: {
            headerRows: 1,
            widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto'],
            body: [
              ['Cant.', 'Descripción', 'Color', 'Unid.', 'Precio', 'Subtotal'],
              ...guia.detalles.map((d) => [
                d.cantidad,
                d.producto.nombre,
                d.colores.map(c => c.color.numero_color).join(', '),
                { text: d.unidad, fontSize: 8 },
                { text: `S/ ${Number(d.precio_unitario).toFixed(2)}`, alignment: 'right' },
                { text: `S/ ${Number(d.subtotal).toFixed(2)}`, alignment: 'right', bold: true }
              ]),
              [
                { text: 'TOTAL GENERAL', colSpan: 5, bold: true, alignment: 'right' }, 
                {}, {}, {}, {}, 
                { text: `S/ ${Number(guia.total_final).toFixed(2)}`, alignment: 'right', bold: true, fontSize: 13 }
              ],
            ],
          },
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 10],
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 10, 0, 5],
        },
      },
    };

    return new Promise((resolve) => {
      const pdfDoc = this.printer.createPdfKitDocument(docDefinition);
      const chunks: Buffer[] = [];
      pdfDoc.on('data', (chunk) => chunks.push(chunk));
      pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
      pdfDoc.end();
    });
  }
}
