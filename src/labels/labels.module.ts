import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MailModule } from '../mail/mail.module';
import { UsersModule } from '../users/users.module';
import { Label } from './entity/label.entity';
import { LabelsController } from './labels.controller';
import { LabelsService } from './labels.service';

@Module({
  imports: [TypeOrmModule.forFeature([Label]), UsersModule, MailModule],
  controllers: [LabelsController],
  providers: [LabelsService],
  exports: [LabelsService],
})
export class LabelsModule {}
