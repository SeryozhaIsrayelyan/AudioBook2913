import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  MinLength,
} from 'class-validator';

export class UpdateUserInfoDto {
  @IsEmail()
  email: string;

  @MinLength(8)
  password: string;

  @IsNotEmpty()
  name: string;

  @IsBoolean()
  gender: boolean;

  @IsNotEmpty()
  country: string;

  @IsDateString()
  birthday: Date;
}
