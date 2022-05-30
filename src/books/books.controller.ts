import {
  Body,
  Controller,
  Get,
  Post,
  SerializeOptions,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  audioFileFilter,
  editFileName,
  imageFileFilter,
  pdfFileFilter,
} from 'src/utils/file-upload.utils';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { diskStorage } from 'multer';
import { AddAudioDto } from './dto/add-audio.dto';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}
  @Get('/getall')
  findAll() {
    return this.booksService.findAll();
  }

  @Get('/getsamples')
  getSamples() {
    return this.booksService.findSamples();
  }

  @Get('/getdefaultbooks')
  getDefault() {
    return this.booksService.findDefault();
  }

  @Get('/getonlyapproved')
  getApproved() {
    return this.booksService.getApproved();
  }

  @UseGuards(JwtAuthGuard)
  @Post('create')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './public/booksimages',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  createBook(
    @Body() createBookDto: CreateBookDto,
    @Request() req,
    @UploadedFile() file,
  ) {
    return this.booksService.createBook(createBookDto, req.user, file);
  }

  @UseGuards(JwtAuthGuard)
  @Post('createNotification')
  createBookNotification(
    @Body() createNotificationDto: CreateNotificationDto,
    @Request() req,
  ) {
    return this.booksService.createBookNotification(createNotificationDto, req.user);
  }

  @Get('getAllNotifications')
  getAllNotifications() {
    return this.booksService.getAllNotifications();
  }

  @Get('getLastNotification')
  getLastNotification() {
    return this.booksService.getLastNotification();
  }
  

  @UseGuards(JwtAuthGuard)
  @Get('approveBook')
  approveBook(@Query() bookQuery, @Request() req) {
    return this.booksService.approveBook(bookQuery['bookId'], req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('addAudio')
  @UseInterceptors(
    FileInterceptor('audio', {
      storage: diskStorage({
        destination: './public/booksaudios',
        filename: editFileName,
      }),
      fileFilter: audioFileFilter,
    }),
  )
  addAudio(
    @Body() addAudioDto: AddAudioDto,
    @Request() req,
    @UploadedFile() file,
  ) {
    return this.booksService.addAudio(addAudioDto, req.user, file);
  }

  @UseGuards(JwtAuthGuard)
  @Post('addPdf')
  @UseInterceptors(
    FileInterceptor('pdf', {
      storage: diskStorage({
        destination: './public/bookspdfs',
        filename: editFileName,
      }),
      fileFilter: pdfFileFilter,
    }),
  )
  addPdf(
    @Body() addAudioDto: AddAudioDto,
    @Request() req,
    @UploadedFile() file,
  ) {
    return this.booksService.addAudio(addAudioDto, req.user, file);
  }

}
