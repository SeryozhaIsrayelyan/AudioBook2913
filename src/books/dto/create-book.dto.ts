import { IsEmail, IsNotEmpty, IsNumber, Min, MinLength } from 'class-validator';

export class CreateBookDto {
  @IsNotEmpty()
  nameEnglish: string;

  @IsNotEmpty()
  descriptionEnglish: string;

  @IsNotEmpty()
  nameArabic: string;

  @IsNotEmpty()
  descriptionArabic: string;

  @IsNotEmpty()
  author: string;

  @IsNumber()
  narrator: number;

  @IsNumber()
  genre: number;

  @IsNumber()
  issample: boolean;

  @IsNumber()
  @Min(100)
  kickoffPledge: number;

  @IsNumber()
  yearOfPublishing: number;

  @IsNotEmpty()
  ISBN: string;
}
