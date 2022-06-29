import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { ConfirmEmailDto } from './dto/confirm-email.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserInfoDto } from './dto/update-user-info.dto';
import * as bcrypt from 'bcryptjs';
import { rename } from 'fs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async makeid(length) {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  async create(createUserDto: CreateUserDto) {
    try {
      if (
        await User.findOne({
          where: {
            email: createUserDto.email,
          },
        })
      ) {
        throw new HttpException(
          {
            status: HttpStatus.FORBIDDEN,
            error: 'User with this email already registered',
          },
          HttpStatus.FORBIDDEN,
        );
      }
      const user = this.userRepo.create(createUserDto);
      const characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      user.verificationCode = '';
      for (let i = 0; i < 20; i++) {
        user.verificationCode += characters.charAt(
          Math.floor(Math.random() * characters.length),
        );
      }
      await user.save();

      ['password', 'createdAt', 'updatedAt'].forEach((element) => {
        delete user[element];
      });
      return user;
    } catch (error) {
      throw new HttpException(
        { status: error?.response?.status, error: error?.response?.error },
        error?.response?.status,
      );
    }
  }

  async confirmVerification(confirmEmailDto: ConfirmEmailDto) {
    try {
      const user = await User.findOne({
        email: confirmEmailDto.email,
        verificationCode: confirmEmailDto.verificationCode,
      });
      if (!user) {
        throw new HttpException(
          {
            status: HttpStatus.FORBIDDEN,
            error: 'User not found',
          },
          HttpStatus.FORBIDDEN,
        );
      }
      if (user.isVerificated) {
        return 'user is already verificated';
      } else {
        user.isVerificated = true;
        await user.save();

        ['password', 'createdAt', 'updatedAt'].forEach((element) => {
          delete user[element];
        });

        return user;
      }
    } catch (error) {
      throw new HttpException(
        { status: error?.response?.status, error: error?.response?.error },
        error?.response?.status,
      );
    }
  }

  async showById(id: number): Promise<User> {
    const user = await this.findById(id);

    delete user.password;
    return user;
  }

  async findById(id: number) {
    return await User.findOne(id);
  }

  async findByEmail(email: string) {
    return await User.findOne({
      where: {
        email: email,
      },
    });
  }

  async changePersonalInfo(
    updateUserInfo: UpdateUserInfoDto,
    user: { userId: number; userName: string; userRole: string },
    file,
  ) {
    try {
      const currentuser = await User.findOne({
        id: user.userId,
      });
      if (!currentuser) {
        throw new HttpException(
          {
            status: HttpStatus.FORBIDDEN,
            error: 'User not found',
          },
          HttpStatus.FORBIDDEN,
        );
      }
      const checkemail = await User.findOne({
        email: updateUserInfo.email,
      });
      if (checkemail && checkemail['id'] != user.userId) {
        throw new HttpException(
          {
            status: HttpStatus.FORBIDDEN,
            error: 'User with this email already exist',
          },
          HttpStatus.FORBIDDEN,
        );
      }
      currentuser['email'] = updateUserInfo['email'];
      currentuser['name'] = updateUserInfo['name'];
      currentuser['gender'] = updateUserInfo['gender'];
      currentuser['country'] = updateUserInfo['country'];
      currentuser['birthday'] = updateUserInfo['birthday'];
      currentuser['password'] = await bcrypt.hash(
        updateUserInfo['password'],
        8,
      );

      if (file) {
        currentuser['avatarExtension'] = file.filename.split('.')[1];
        currentuser['isAvatarSet'] = true;
        await rename(
          file.path,
          'public\\usersimages\\' +
            currentuser['id'] +
            '.' +
            currentuser['avatarExtension'],
          function (err) {
            if (err) console.log('Error: ' + err);
          },
        );
      }

      await currentuser.save();
      return 'nice';
    } catch (error) {
      throw new HttpException(
        { status: error?.response?.status, error: error?.response?.error },
        error?.response?.status,
      );
    }
  }

  async getPersonalInfo(
    updateUserInfo: UpdateUserInfoDto,
    user: { userId: number; userName: string; userRole: string },
  ) {
    try {
      const currentuser = await User.findOne({
        id: user.userId,
      });
      if (!currentuser) {
        throw new HttpException(
          {
            status: HttpStatus.FORBIDDEN,
            error: 'User not found',
          },
          HttpStatus.FORBIDDEN,
        );
      }
      delete currentuser.password;
      delete currentuser.verificationCode;
      delete currentuser.createdAt;
      delete currentuser.updatedAt;
      currentuser['imagePath'] =
        process.env.HOST_URL +
        'public/usersimages/' +
        currentuser.id +
        '.' +
        currentuser.avatarExtension;
      delete currentuser.avatarExtension;
      return currentuser;
    } catch (error) {
      throw new HttpException(
        { status: error?.response?.status, error: error?.response?.error },
        error?.response?.status,
      );
    }
  }
}
