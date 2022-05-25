import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { Genre } from './entities/genre.entity';

@Injectable()
export class GenresService {
  async create(createGenreDto: CreateGenreDto, user: { userId: number; userName: string; userRole: string },) {
    try {
      if(user.userRole != 'administrator') {
        throw new HttpException(
          {
            status: HttpStatus.FORBIDDEN,
            error: 'You are not an administrator',
          },
          HttpStatus.FORBIDDEN,
        );
      }
      return await Genre.create(createGenreDto);
    }
    catch(error) {

    }
  }

  async findAll() {
    return await Genre.find();
  }
}
