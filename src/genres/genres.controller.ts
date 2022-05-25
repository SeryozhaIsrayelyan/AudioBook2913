import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { GenresService } from './genres.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('genres')
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createGenreDto: CreateGenreDto, @Request() req) {
    return this.genresService.create(createGenreDto, req.user);
  }

  @Get()
  findAll() {
    return this.genresService.findAll();
  }
}
