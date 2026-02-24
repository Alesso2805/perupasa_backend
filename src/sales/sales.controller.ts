import { Controller, Post, Body, Get, Param, Res, NotFoundException } from '@nestjs/common';
import { SalesService, CreateGuiaDto } from './sales.service';
import { PdfService } from './pdf.service';
import type { Response } from 'express';

@Controller('sales')
export class SalesController {
  constructor(
    private readonly salesService: SalesService,
    private readonly pdfService: PdfService,
  ) {}

  @Post()
  create(@Body() createGuiaDto: CreateGuiaDto) {
    return this.salesService.createGuia(createGuiaDto);
  }

  @Get('next-number')
  getNextNumber() {
    return this.salesService.findNextNumber();
  }

  @Get()
  findAll() {
    return this.salesService.findAll();
  }

  @Get(':id/pdf')
  async generatePdf(@Param('id') id: number, @Res() res: Response) {
    const guia = await this.salesService.findAll().then(guias => guias.find(g => g.id == id));
    if (!guia) throw new NotFoundException('Guia not found');

    const buffer = await this.pdfService.generateGuiaPdf(guia);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=guia-${guia.numero_guia}.pdf`,
      'Content-Length': buffer.length,
    });

    res.end(buffer);
  }
}
