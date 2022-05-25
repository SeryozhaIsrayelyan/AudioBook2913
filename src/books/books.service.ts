import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { readFile, rename, unlink } from 'fs';

import { Repository } from 'typeorm';
import { AddAudioDto } from './dto/add-audio.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { FindSamplesDto } from './dto/find-samples.dto';

import { Book } from './entities/book.entity';

@Injectable()
export class BooksService {
  async findAll() {
    return await Book.find();
  }

  async findSamples() {
    const books = await Book.find({
      where: {
        issample: true,
      },
    });
    books.forEach((book) => {
      ['issample', 'createdAt', 'updatedAt'].forEach((element) => {
        delete book[element];
      });
    });

    return books;
  }

  async findDefault() {
    return await Book.find({
      where: {
        issample: false,
      },
    });
  }

  async getApproved() {
    return await Book.createQueryBuilder('book')
      .where('book.status != :status', { status: 1 })
      .getMany();
  }

  async createBook(
    createBookDto: CreateBookDto,
    user: { userId: number; userName: string; userRole: string },
    file,
  ) {
    if (file) {
      createBookDto['usersuggested'] = user.userId;
      createBookDto['imageext'] = file.filename.split('.')[1];
      createBookDto['status'] = 1;
      const newbook = await Book.create(createBookDto);
      await newbook.save();
      await rename(
        file.path,
        'public\\booksimages\\' + newbook.id + '.' + createBookDto['imageext'],
        function (err) {
          if (err) console.log('Error: ' + err);
        },
      );
      return 'success';
    }
    return 'error';
  }

  async approveBook(
    bookId: number,
    user: { userId: number; userName: string; userRole: string },
  ) {
    try {
      if (bookId == undefined) {
        throw new HttpException(
          {
            status: HttpStatus.FORBIDDEN,
            error: 'Book id is undefined',
          },
          HttpStatus.FORBIDDEN,
        );
      }
      const currentbook = await Book.findOne({ id: bookId });
      if (!currentbook) {
        throw new HttpException(
          {
            status: HttpStatus.FORBIDDEN,
            error: "Book with this id doesn't exist",
          },
          HttpStatus.FORBIDDEN,
        );
      }

      if (currentbook.status != 1) {
        throw new HttpException(
          {
            status: HttpStatus.FORBIDDEN,
            error: "This book isn't in queue",
          },
          HttpStatus.FORBIDDEN,
        );
      }

      if (user.userRole != 'administrator') {
        throw new HttpException(
          {
            status: HttpStatus.FORBIDDEN,
            error: "You aren't administrator",
          },
          HttpStatus.FORBIDDEN,
        );
      }

      currentbook.status = 2;
      await currentbook.save();
      return 'success';
    } catch (error) {
      throw new HttpException(
        { status: error?.response?.status, error: error?.response?.error },
        error?.response?.status,
      );
    }
  }

  async addAudio(
    addAudioDto: AddAudioDto,
    user: { userId: number; userName: string; userRole: string },
    file,
  ) {
    try {
      if (file) {
        const currentbook = await Book.findOne({
          id: addAudioDto.id,
          usersuggested: user.userId,
        });
        if (!currentbook) {
          await unlink(file.path,function (err) {
            if (err) console.log('Error: ' + err);
          });
          throw new HttpException(
            {
              status: HttpStatus.FORBIDDEN,
              error: 'There is no book with this id',
            },
            HttpStatus.FORBIDDEN,
          );
        }
        if(user.userRole != 'administrator') {
          await unlink(file.path,function (err) {
            if (err) console.log('Error: ' + err);
          });
          throw new HttpException(
            {
              status: HttpStatus.FORBIDDEN,
              error: 'You are not an administrator',
            },
            HttpStatus.FORBIDDEN,
          );
        }
        const fileExtension = file.filename.split('.')[1];
        await rename(
          file.path,
          'public\\booksaudios\\' +
            addAudioDto.id +
            '_' +
            (currentbook.audiocount + 1) +
            '.' +
            fileExtension,
          function (err) {
            if (err) console.log('Error: ' + err);
          },
        );
        currentbook.audiocount++;
        await currentbook.save();
        return 'success';
      } else {
        throw new HttpException(
          {
            status: HttpStatus.FORBIDDEN,
            error: 'No file is in post',
          },
          HttpStatus.FORBIDDEN,
        );
      }
    } catch (error) {
      throw new HttpException(
        { status: error?.response?.status, error: error?.response?.error },
        error?.response?.status,
      );
    }
  }

  async addPdf(
    addAudioDto: AddAudioDto,
    user: { userId: number; userName: string; userRole: string },
    file,
  ) {
    try {
      if (file) {
        const currentbook = await Book.findOne({
          id: addAudioDto.id,
          usersuggested: user.userId,
        });
        if (!currentbook) {
          await unlink(file.path,function (err) {
            if (err) console.log('Error: ' + err);
          });
          throw new HttpException(
            {
              status: HttpStatus.FORBIDDEN,
              error: 'There is no book with this id',
            },
            HttpStatus.FORBIDDEN,
          );
        }
        if(user.userRole != 'administrator') {
          await unlink(file.path,function (err) {
            if (err) console.log('Error: ' + err);
          });
          throw new HttpException(
            {
              status: HttpStatus.FORBIDDEN,
              error: 'You are not an administrator',
            },
            HttpStatus.FORBIDDEN,
          );
        }
        const fileExtension = file.filename.split('.')[1];
        await rename(
          file.path,
          'public\\bookspdfs\\' +
            addAudioDto.id +
            '.' +
            fileExtension,
          function (err) {
            if (err) console.log('Error: ' + err);
          },
        );
        currentbook.isPdfAdded = true;
        await currentbook.save();
        return 'success';
      } else {
        throw new HttpException(
          {
            status: HttpStatus.FORBIDDEN,
            error: 'No file is in post',
          },
          HttpStatus.FORBIDDEN,
        );
      }
    } catch (error) {
      throw new HttpException(
        { status: error?.response?.status, error: error?.response?.error },
        error?.response?.status,
      );
    }
  }
}
