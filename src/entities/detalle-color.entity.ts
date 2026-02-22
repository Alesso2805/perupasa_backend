import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { DetalleGuia } from './detalle-guia.entity';
import { Color } from './color.entity';

@Entity()
export class DetalleColor {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => DetalleGuia, (detalleGuia) => detalleGuia.colores)
  detalleGuia: DetalleGuia;

  @ManyToOne(() => Color, (color) => color.detalles)
  color: Color;

  @Column('int')
  cantidad: number;
}
