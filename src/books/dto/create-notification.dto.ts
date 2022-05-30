import { IsEmail, IsNotEmpty, IsNumber, Min, MinLength } from 'class-validator';

export class CreateNotificationDto {
  @IsNotEmpty()
  nameEnglish: string;

  @IsNotEmpty()
  nameArabic: string;

  @IsNotEmpty()
  authorEnglish: string;

  @IsNotEmpty()
  authorArabic: string;

  @IsNumber()
  yearOfPublishing: number;

  @IsNotEmpty()
  ISBN: string;

  @IsNumber()
  @Min(100)
  kickoffPledge: number;

}
