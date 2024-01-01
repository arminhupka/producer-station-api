import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Billing } from '../../billings/entity/billing.entity';
import { Label } from '../../labels/entity/label.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  @Expose()
  id: string;

  @Column({ nullable: false })
  @ApiProperty()
  @Expose()
  username: string;

  @Column({ nullable: false })
  @ApiProperty()
  @Expose()
  email: string;

  @Column({ nullable: false })
  @ApiProperty()
  @Expose()
  password: string;

  @Column({ default: false })
  @ApiProperty()
  @Expose()
  activated: boolean;

  @Column({ default: false })
  @ApiProperty()
  @Expose()
  banned: boolean;

  @Column({ nullable: true })
  @ApiProperty()
  @Expose()
  activationToken: string | null;

  @Column({ nullable: true })
  @ApiProperty()
  @Expose()
  resetPasswordToken: string | null;

  @OneToOne(() => Billing, { onDelete: 'CASCADE' })
  @JoinColumn()
  @ApiProperty({ type: () => Billing })
  @Expose()
  billing: Billing;

  @OneToMany(() => Label, (label) => label.user)
  @ApiProperty({ type: () => Label, isArray: true })
  @Expose()
  labels: Label[];

  @CreateDateColumn()
  @ApiProperty()
  @Expose()
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty()
  @Expose()
  updatedAt: Date;
}
