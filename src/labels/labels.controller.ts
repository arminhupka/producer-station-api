import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { UsersService } from '../users/users.service';
import { CreateLabelDto } from './dto/create-label.dto';
import { UpdateLabelDto } from './dto/update-label.dto';
import { LabelsService } from './labels.service';

@ApiTags('Labels')
@Controller('labels')
export class LabelsController {
  constructor(
    private readonly labelsService: LabelsService,
    private readonly usersService: UsersService,
  ) {}

  @ApiOperation({ summary: 'Creating new label' })
  @Post('/')
  async create(@Body() { name }: CreateLabelDto) {
    const user = await this.usersService.findById(
      'e75e460f-60f0-4e60-9d89-153c6715fc3a',
    );
    return this.labelsService.create(user, name);
  }

  @ApiOperation({ summary: 'Updating label' })
  @Patch('/:id')
  update(@Param('id') id: string, @Body() dto: UpdateLabelDto) {
    return this.labelsService.update(id, dto);
  }

  @ApiOperation({ summary: 'Deleting label' })
  @Delete('/:id')
  delete(@Param('id') id: string) {
    return this.labelsService.delete(id);
  }
}
