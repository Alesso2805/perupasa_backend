import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Precio } from './precio.entity';
import { DetalleGuia } from './detalle-guia.entity';

@Entity()
export class Producto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  codigo_articulo: string;

  @Column()
  nombre: string;

  @Column()
  categoria: string;

  @OneToMany(() => Precio, (precio) => precio.producto)
  precios: Precio[];

  @OneToMany(() => DetalleGuia, (detalle) => detalle.producto)
  detallesGuia: DetalleGuia[];
}
