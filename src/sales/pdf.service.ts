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
                d.producto?.nombre || 'Producto no encontrado',
                d.colores?.map(c => c.color?.numero_color ?? 'N/A').join(', ') || 'N/A',
                { text: d.unidad || 'Unid.', fontSize: 8 },
                { text: `S/ ${Number(d.precio_unitario || 0).toFixed(2)}`, alignment: 'right' },
                { text: `S/ ${Number(d.subtotal || 0).toFixed(2)}`, alignment: 'right', bold: true }
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
