import { Injectable } from '@nestjs/common';
import { CreateContactUsDto } from './dto/create-contact-us.dto';
import { UpdateContactUsDto } from './dto/update-contact-us.dto';
import { ContactUs } from './entities/contact-us.entity';

@Injectable()
export class ContactUsService {
  async create(createContactUsDto: CreateContactUsDto) {
    return await ContactUs.create(createContactUsDto);
  }
}
