import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  Request,
  UploadedFile,
  Query,
  Res,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateCardDto } from './dto/update-card.dto';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentService: PaymentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('updateCard')
  updateCard(@Body() updateCardInfo: UpdateCardDto, @Request() req) {
    return this.paymentService.updateCard(updateCardInfo, req.user);
  }

  @Get('pay')
  async pay() {
    return await this.paymentService.pay();
  }

  @Get('success')
  success(@Query() query) {
    return this.paymentService.success(query);
  }

  @Get('cancel')
  cancel() {
    return 'cancelled';
  }
}
