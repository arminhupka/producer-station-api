import { Body, Controller, Param, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { OkResponse } from '../responses/ok.response';
import { UsersService } from '../users/users.service';
import { ActivateAccountDto } from './dto/activate-account.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@ApiTags('Account')
@Controller('account')
export class AccountController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Create new account' })
  @ApiOkResponse({ type: OkResponse })
  @ApiConflictResponse()
  @ApiBadRequestResponse()
  @Post('/register')
  async register(@Body() dto: RegisterDto) {
    const { email, username, password, passwordConfirm } = dto;
    return this.usersService
      .create(email, username, password, passwordConfirm)
      .then(() => ({
        ok: true,
      }));
  }

  @ApiOperation({ summary: 'Activating new account' })
  @ApiOkResponse({ type: OkResponse })
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  @Post('/activation')
  async activate(@Body() dto: ActivateAccountDto) {
    return this.usersService.activateAccount(dto.token).then(() => ({
      ok: true,
    }));
  }

  @ApiOperation({ summary: 'Requesting token for changing password' })
  @ApiOkResponse({ type: OkResponse })
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  @Post('/reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.usersService.requestResetPasswordToken(dto.email).then(() => ({
      ok: true,
    }));
  }

  @ApiOperation({ summary: 'Change password using token' })
  @ApiOkResponse({ type: OkResponse })
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  @Post('/reset-password/:token')
  async changePassword(
    @Body() dto: ChangePasswordDto,
    @Param('id') id: string,
  ) {
    return this.usersService
      .changePasswordWithResetToken(id, dto.password, dto.passwordConfirm)
      .then(() => ({
        ok: true,
      }));
  }
}
