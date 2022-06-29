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
  Response,
  Param,
  Delete,
  Put,
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
import { UpdateBookDto } from './dto/update-book.dto';

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

  @Get('/getByStatus/:status')
  async getByStatus(
    // @Response() res,
    @Param('status') status: string
  ) {
    return await this.booksService.getByStatus(+status);
    // return await res
    //   .append('X-Total-Count', books[1])
    //   .append('Access-Control-Expose-Headers', 'X-Total-Count')
    //   .append('Content-Range', 'posts 0-10/' + books[1])
    //   .append('Access-Control-Expose-Headers', 'Content-Range')
    //   .json(books[0]);
  }


  @Get('/getByStatus/:status/:id')
  async getByStatusById(@Param('status') status: string, @Param('id') id: string) {
    return await this.booksService.getByStatusById(+status, +id);
    // return await res
    //   .append('X-Total-Count', books[1])
    //   .append('Access-Control-Expose-Headers', 'X-Total-Count')
    //   .append('Content-Range', 'posts 0-1/' + books[1])
    //   .append('Access-Control-Expose-Headers', 'Content-Range')
    //   .json(books[0]);
  }

  
  // @UseGuards(JwtAuthGuard)
  @Delete('/getByStatus/:status/:id')
  async deleteByStatus(@Param('id') id: string) {
    // return await this.booksService.deleteNotification(+id, req.user);
    return await this.booksService.deleteNotification(+id);
  }

  // @UseGuards(JwtAuthGuard)
  @Put('/getByStatus/:status/:id')
  // @UseInterceptors(
  //   FileInterceptor('image', {
  //     storage: diskStorage({
  //       destination: './public/booksimages',
  //       filename: editFileName,
  //     }),
  //     fileFilter: imageFileFilter,
  //   }),
  // )
  async editByStatus(
    @Body() updateNotification: UpdateBookDto,
    // @Request() req,
    // @UploadedFile() file,
  ) {
    // return this.booksService.acceptNotification(updateNotification, req.user, file);
    // return this.booksService.acceptNotification(updateNotification, req.user);
    return await this.booksService.acceptNotification(updateNotification);
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
    return this.booksService.createBookNotification(
      createNotificationDto,
      req.user,
    );
  }

  @Get('getAllNotifications')
  async getAllNotifications(@Response() res) {
    const books = await this.booksService.getAllNotifications();
    return await res
      .append('X-Total-Count', books[1])
      .append('Access-Control-Expose-Headers', 'X-Total-Count')
      .append('Content-Range', 'posts 0-10/' + books[1])
      .append('Access-Control-Expose-Headers', 'Content-Range')
      .json(books[0]);
  }

  @Get('getLastNotification')
  async getLastNotification(@Response() res) {
    const book = await this.booksService.getLastNotification();
    console.log(book[0]);
    return await res
      .append('X-Total-Count', book[1])
      .append('Access-Control-Expose-Headers', 'X-Total-Count')
      .append('Content-Range', 'posts 0-1/' + book[1])
      .append('Access-Control-Expose-Headers', 'Content-Range')
      .json(book[0]);
  }

  @Get('getAllNotifications/:id')
  async getAllNotificationsById(@Response() res, @Param('id') id: string) {
    const books = await this.booksService.getNotification(+id);
    return await res
      .append('X-Total-Count', books[1])
      .append('Access-Control-Expose-Headers', 'X-Total-Count')
      .append('Content-Range', 'posts 0-1/' + books[1])
      .append('Access-Control-Expose-Headers', 'Content-Range')
      .json(books[0]);
  }

  @Get('getLastNotification/:id')
  async getLastNotificationById(@Response() res, @Param('id') id: string) {
    const book = await this.booksService.getNotification(+id);
    console.log(book[0]);
    return await res
      .append('X-Total-Count', book[1])
      .append('Access-Control-Expose-Headers', 'X-Total-Count')
      .append('Content-Range', 'posts 0-1/' + book[1])
      .append('Access-Control-Expose-Headers', 'Content-Range')
      .json(book[0]);
  }

  // @UseGuards(JwtAuthGuard)
  @Delete('getAllNotifications/:id')
  async DeleteNotificationById(@Param('id') id: string) {
    // return await this.booksService.deleteNotification(+id, req.user);
    return await this.booksService.deleteNotification(+id);
  }

  // @UseGuards(JwtAuthGuard)
  @Put('getAllNotifications/:id')
  // @UseInterceptors(
  //   FileInterceptor('image', {
  //     storage: diskStorage({
  //       destination: './public/booksimages',
  //       filename: editFileName,
  //     }),
  //     fileFilter: imageFileFilter,
  //   }),
  // )
  acceptNotification(
    @Body() updateNotification: UpdateBookDto,
    // @Request() req,
    // @UploadedFile() file,
  ) {
    // return this.booksService.acceptNotification(updateNotification, req.user, file);
    // return this.booksService.acceptNotification(updateNotification, req.user);
    return this.booksService.acceptNotification(updateNotification);
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
