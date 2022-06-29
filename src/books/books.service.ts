import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { existsSync, readFile, rename, unlink } from 'fs';

import { Repository } from 'typeorm';
import { AddAudioDto } from './dto/add-audio.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { FindSamplesDto } from './dto/find-samples.dto';
import { UpdateBookDto } from './dto/update-book.dto';

import { Book } from './entities/book.entity';

@Injectable()
export class BooksService {
  async findAll() {
    const books = await Book.find();

    if (books) {
      books.forEach((book) => {
        ['issample', 'createdAt', 'updatedAt'].forEach((element) => {
          delete book[element];
        });
        book['imageLink'] =
          process.env.HOST_URL + ':3000/' +
          'booksimages/' +
          (book['isImage']
            ? existsSync(
                './public/booksimages/' + book['id'] + '.' + book['imageext'],
              )
              ? book['id']
              : 'default'
            : 'default') +
          '.' +
          book['imageext'];
      });
    }

    return {"books":books};
  }

  async findSamples() {
    const books = await Book.find({
      where: {
        issample: true,
      },
    });
    if (books) {
      books.forEach((book) => {
        ['issample', 'createdAt', 'updatedAt'].forEach((element) => {
          delete book[element];
        });
        book['imageLink'] =
          process.env.HOST_URL + ':3000/' +
          'booksimages/' +
          (book['isImage']
            ? existsSync(
                './public/booksimages/' + book['id'] + '.' + book['imageext'],
              )
              ? book['id']
              : 'default'
            : 'default') +
          '.' +
          book['imageext'];
      });
    }

    return {"books":books};
  }

  async findDefault() {
    const books = await Book.createQueryBuilder('book')
      .where('issample = false')
      .getMany();

    if (books) {
      books.forEach((book) => {
        ['issample', 'createdAt', 'updatedAt'].forEach((element) => {
          delete book[element];
        });
        book['imageLink'] =
          process.env.HOST_URL + ':3000/' +
          'booksimages/' +
          (book['isImage']
            ? existsSync(
                './public/booksimages/' + book['id'] + '.' + book['imageext'],
              )
              ? book['id']
              : 'default'
            : 'default') +
          '.' +
          book['imageext'];
      });
    }

    return {"books":books};
  }

  async getApproved() {
    const books = await Book.createQueryBuilder('book')
      .where('book.status = :status', { status: 2 })
      .getMany();
    if (books) {
      books.forEach((book) => {
        ['issample', 'createdAt', 'updatedAt'].forEach((element) => {
          delete book[element];
        });
        book['imageLink'] =
          process.env.HOST_URL + ':3000/' +
          'booksimages/' +
          (book['isImage']
            ? existsSync(
                './public/booksimages/' + book['id'] + '.' + book['imageext'],
              )
              ? book['id']
              : 'default'
            : 'default') +
          '.' +
          book['imageext'];
      });
    }
    return {"books":books};
  }

  async getByStatus(
    status: number
  ) {
    const books = await Book.createQueryBuilder('book')
      .where('book.status = :status', { status: status })
      .orderBy('id', 'DESC')
      // .getManyAndCount();
      .getMany();

    if (books) {
      books.forEach((book) => {
        ['issample', 'createdAt', 'updatedAt'].forEach((element) => {
          delete book[element];
        });
        book['imageLink'] =
          process.env.HOST_URL + ':3000/' +
          'booksimages/' +
          (book['isImage']
            ? existsSync(
                './public/booksimages/' + book['id'] + '.' + book['imageext'],
              )
              ? book['id']
              : 'default'
            : 'default') +
          '.' +
          book['imageext'];
      });
      
    }
    return {"books":books};
  }

  async getByStatusById(
    status: number,
    id: number
  ) {
    const book = await Book.createQueryBuilder('book')
      .where('book.status = :status', { status: status })
      .where('book.id = :id', {id: id})
      .getOneOrFail();

      if (book) {
        ['issample', 'createdAt', 'updatedAt'].forEach((element) => {
          delete book[element];
        });
        book['imageLink'] =
          process.env.HOST_URL + ':3000/' +
          'booksimages/' +
          (book['isImage']
            ? existsSync(
                './public/booksimages/' + book['id'] + '.' + book['imageext'],
              )
              ? book['id']
              : 'default'
            : 'default') +
          '.' +
          book['imageext'];
   
        return [book,1];
      }
  
      return [book,0];
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

  async createBookNotification(
    createNotificationDto: CreateNotificationDto,
    user: { userId: number; userName: string; userRole: string },
  ) {
    try {
      createNotificationDto['usersuggested'] = user.userId;
      createNotificationDto['status'] = 1;
      const newbook = await Book.create(createNotificationDto);
      await newbook.save();
      return { message: 'success' };
    } catch (error) {
      return { message: 'error' };
    }
  }

  async getAllNotifications() {
    const books = await Book.createQueryBuilder('book')
      .where('status = :status', { status: 1 })
      .orderBy('id', 'DESC')
      .getManyAndCount();

      // .innerJoin('status', 'book.status = status.id')
      // .select('status.name as statusName, books.*')

    if (books[0]) {
      books[0].forEach((book) => {
        ['issample', 'createdAt', 'updatedAt'].forEach((element) => {
          delete book[element];
        });
        book['imageLink'] =
          process.env.HOST_URL + ':3000/' +
          'booksimages/' +
          (book['isImage']
            ? existsSync(
                './public/booksimages/' + book['id'] + '.' + book['imageext'],
              )
              ? book['id']
              : 'default'
            : 'default') +
          '.' +
          book['imageext'];
      });
      
    }
    return books;
  }

  async getLastNotification() {
    const book = await Book.createQueryBuilder('book')
      .where('status = :status', { status: 1 })
      .orderBy('id', 'DESC')
      .getOne();

    if (book) {
      ['issample', 'createdAt', 'updatedAt'].forEach((element) => {
        delete book[element];
      });
      book['imageLink'] =
        process.env.HOST_URL + ':3000/' +
        'booksimages/' +
        (book['isImage']
          ? existsSync(
              './public/booksimages/' + book['id'] + '.' + book['imageext'],
            )
            ? book['id']
            : 'default'
          : 'default') +
        '.' +
        book['imageext'];

	return [[book],1];
    }

    return [[book],0];
  }

  async getNotification(id: number) {
    const book = await Book.createQueryBuilder()
      .where('id = :id AND status = :status', { id: id, status: 1 })
      .getOneOrFail();

    if (book) {
      ['issample', 'createdAt', 'updatedAt'].forEach((element) => {
        delete book[element];
      });
      book['imageLink'] =
        process.env.HOST_URL + ':3000/' +
        'booksimages/' +
        (book['isImage']
          ? existsSync(
              './public/booksimages/' + book['id'] + '.' + book['imageext'],
            )
            ? book['id']
            : 'default'
          : 'default') +
        '.' +
        book['imageext'];
 
	    return [book,1];
    }

    return [book,0];
  }

  async acceptNotification(
    updateNotification: UpdateBookDto,
    // user: { userId: number; userName: string; userRole: string },
    // file,
  ) {
    // if (file) {
    //   updateNotification['imageext'] = file.filename.split('.')[1];
    //   updateNotification['status'] = 2;
    //   const result = await Book.update(updateNotification['id'], updateNotification);
    //   await rename(
    //     file.path,
    //     'public\\booksimages\\' + updateNotification['id'] + '.' + updateNotification['imageext'],
    //     function (err) {
    //       if (err) console.log('Error: ' + err);
    //     },
    //   );
    //   return 'success';
    // }
    // return 'error';
      // updateNotification['status'] = 2;
      // if(user.userRole == 'administrator') {
        const result = await Book.update({id:updateNotification['id']}, updateNotification);
        // return result ? 'success' : 'error';
        return updateNotification;
        // return 'success';
      // }
      // else{
      //   return 'You need to be an administrator';
      // }
      
  }

  // async deleteNotification(id: number, user: { userId: number; userName: string; userRole: string }) {
    async deleteNotification(id: number) {
    // return (user.userRole == 'administrator' ?  await Book.createQueryBuilder('book').update().set({ status: 3 }).where("id = :id", { id: id }).execute() : 'You need to be an administrator');
      return await Book.createQueryBuilder('book').update().set({ status: 7 }).where("id = :id", { id: id }).execute();
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
          await unlink(file.path, function (err) {
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
        if (user.userRole != 'administrator') {
          await unlink(file.path, function (err) {
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
          await unlink(file.path, function (err) {
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
        if (user.userRole != 'administrator') {
          await unlink(file.path, function (err) {
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
          'public\\bookspdfs\\' + addAudioDto.id + '.' + fileExtension,
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
