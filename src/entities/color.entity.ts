import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { DetalleColor } from './detalle-color.entity';

@Entity()
export class Color {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  numero_color: number;

  @OneToMany(() => DetalleColor, (detalle) => detalle.color)
  detalles: DetalleColor[];
}
