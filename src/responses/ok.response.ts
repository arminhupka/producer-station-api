import { ApiProperty } from '@nestjs/swagger';

export class OkResponse {
  @ApiProperty()
  ok: boolean;
}
