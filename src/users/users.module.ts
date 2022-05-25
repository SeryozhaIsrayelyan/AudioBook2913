import { Module } from '@nestjs/common';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MailService } from 'src/mail/mail.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';

@Module({
  controllers: [UsersController],
  providers: [UsersService, MailService],
  exports: [UsersService],
  imports: [TypeOrmModule.forFeature([User]), MailService],
})
export class UsersModule {}
