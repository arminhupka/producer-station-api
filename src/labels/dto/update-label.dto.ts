import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { LabelStatus } from '../enum/label-status.enum';

export class UpdateLabelDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ enum: LabelStatus })
  @IsEnum(LabelStatus)
  @IsOptional()
  status?: LabelStatus;
}
