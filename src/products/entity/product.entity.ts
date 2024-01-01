import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Label } from '../../labels/entity/label.entity';
import { ProductStatus } from '../enum/product-status.enum';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  @Expose()
  id: string;

  @Column({ nullable: false })
  @ApiProperty({ nullable: false })
  @Expose()
  name: string;

  @Column({ default: '' })
  @ApiProperty()
  @Expose()
  description: string;

  @Column({ default: '' })
  @ApiProperty()
  @Expose()
  shortDescription: string;

  @Column({ default: null })
  @ApiProperty({ nullable: true })
  @Expose()
  price: number | null;

  @Column({ default: null })
  @ApiProperty({ nullable: true })
  @Expose()
  salePrice: number | null;

  @Column({ default: false })
  @ApiProperty()
  @Expose()
  featured: boolean;

  @Column({ type: 'enum', enum: ProductStatus, default: ProductStatus.DARFT })
  @ApiProperty({ default: ProductStatus.DARFT })
  @Expose()
  status: ProductStatus;

  @ManyToOne(() => Label, (label) => label.products, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @ApiProperty()
  @Expose()
  label: Label;

  @Column({ nullable: false })
  @ApiProperty({ nullable: false })
  @Expose()
  slug: string;

  @Column({ default: null })
  @ApiProperty({ nullable: true })
  @Expose()
  submittedAt: Date | null;

  @CreateDateColumn()
  @ApiProperty()
  @Expose()
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty()
  @Expose()
  updatedAt: Date;
}
