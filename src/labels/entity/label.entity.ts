import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Product } from '../../products/entity/product.entity';
import { User } from '../../users/entity/user.entity';
import { LabelStatus } from '../enum/label-status.enum';

@Entity()
export class Label {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  @Expose()
  id: string;

  @Column({ nullable: false })
  @ApiProperty({ nullable: false })
  @Expose()
  name: string;

  @Column({ default: '' })
  @ApiProperty({
    nullable: false,
  })
  @Expose()
  description: string;

  @Column({ type: 'enum', enum: LabelStatus, default: LabelStatus.DRAFT })
  @ApiProperty({ enum: LabelStatus })
  @Expose()
  status: LabelStatus;

  @Column({ nullable: false })
  @ApiProperty({ nullable: false })
  @Expose()
  commissionRate: number;

  @Column({ nullable: false })
  @ApiProperty({ nullable: false })
  @Expose()
  slug: string;

  @ManyToOne(() => User, (user) => user.labels, {
    onDelete: 'CASCADE',
  })
  @ApiProperty({ type: () => User })
  @Expose()
  user: User;

  @OneToMany(() => Product, (product) => product.label)
  products: Product[];

  @CreateDateColumn()
  @ApiProperty()
  @Expose()
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty()
  @Expose()
  updatedAt: Date;
}
