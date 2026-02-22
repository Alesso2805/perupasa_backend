import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { GuiaVenta } from './guia-venta.entity';
import { Producto } from './producto.entity';
import { DetalleColor } from './detalle-color.entity';

@Entity()
export class DetalleGuia {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => GuiaVenta, (guia) => guia.detalles)
  guiaVenta: GuiaVenta;

  @ManyToOne(() => Producto, (producto) => producto.detallesGuia)
  producto: Producto;

  @Column('int')
  cantidad: number;

  @Column('decimal', { precision: 10, scale: 2 })
  precio_unitario: number;

  @Column('decimal', { precision: 10, scale: 2 })
  subtotal: number;

  @OneToMany(() => DetalleColor, (detalleColor) => detalleColor.detalleGuia, { cascade: true })
  colores: DetalleColor[];
}
