import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, MinLength } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ description: 'Label UUID' })
  @IsUUID()
  label: string;

  @ApiProperty({ minLength: 6, description: 'Product name' })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  name: string;
}
