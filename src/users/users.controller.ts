import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  Request,
  UploadedFile,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { MailService } from 'src/mail/mail.service';
import { ConfirmEmailDto } from './dto/confirm-email.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { editFileName, imageFileFilter } from 'src/utils/file-upload.utils';
import { diskStorage } from 'multer';
import { UpdateUserInfoDto } from './dto/update-user-info.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly mailsService: MailService,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    // const x = await this.usersService.create(createUserDto);
    // return this.mailsService.sendMail(x['email'], x['verificationCode']);
    // return this.mailsService.sendMail(x['email'], x['verificationCode']);
    return await this.usersService.create(createUserDto);
  }

  @Post('confirmEmail')
  confirmEmail(@Body() confirmEmailDto: ConfirmEmailDto) {
    return this.usersService.confirmVerification(confirmEmailDto);
  }

  @Get('getuser/:id')
  show(@Param('id') id: string) {
    return this.usersService.showById(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('changePersonalInfo')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './public/usersimages',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  changePersonalInfo(
    @Body() updateUserInfo: UpdateUserInfoDto,
    @Request() req,
    @UploadedFile() file,
  ) {
    return this.usersService.changePersonalInfo(updateUserInfo, req.user, file);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getPersonalInfo')
  getPersonalInfo(@Body() updateUserInfo: UpdateUserInfoDto, @Request() req) {
    return this.usersService.getPersonalInfo(updateUserInfo, req.user);
  }
}
