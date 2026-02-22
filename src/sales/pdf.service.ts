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
            widths: ['auto', '*', 'auto', 'auto', 'auto'],
            body: [
              ['Cant.', 'Descripción', 'Unit.', 'Subtotal', 'Detalle Color'],
              ...guia.detalles.map((d) => [
                d.cantidad,
                d.producto.nombre,
                d.precio_unitario,
                d.subtotal,
                {
                   text: d.colores.map(c => `Col ${c.color.numero_color}: ${c.cantidad}`).join(', '),
                   fontSize: 9
                }
              ]),
              [{ text: 'TOTAL', colSpan: 3, bold: true }, {}, {}, guia.total_final, {}],
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
