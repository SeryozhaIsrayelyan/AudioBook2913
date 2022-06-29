import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateCardDto } from './dto/update-card.dto';
import { Card } from './entities/card.entity';
import { configure, payment } from 'paypal-rest-sdk';


@Injectable()
export class PaymentsService {

  async updateCard(
    updateCardInfo: UpdateCardDto,
    user: { userId: number; userName: string; userRole: string },
  ) {
    try {
      const currentCard = await Card.findOne({ userId: user.userId });
      if (!currentCard) {
        updateCardInfo['userId'] = user.userId;
        const newCard = await Card.create(updateCardInfo).save();
        if (newCard) {
          return 'success';
        } else {
          throw new HttpException(
            {
              status: HttpStatus.FORBIDDEN,
              error: 'Card creating error',
            },
            HttpStatus.FORBIDDEN,
          );
        }
      }
      currentCard.cardNumber = updateCardInfo.cardNumber;
      currentCard.cardExpiring = updateCardInfo.cardExpiring;
      currentCard.cardCVV = updateCardInfo.cardCVV;
      currentCard.cardOwner = updateCardInfo.cardOwner;
      await currentCard.save();
      return 'success';
    } catch (error) {
      throw new HttpException(
        { status: error?.response?.status, error: error?.response?.error },
        error?.response?.status,
      );
    }
  }

  pay() {
    configure({
      mode: process.env.PAYPAL_ENVIRONMENT,
      client_id:
        process.env.PAYPAL_CLIENT_ID,
      client_secret:
        process.env.PAYPAL_CLIENT_SECRET,
    });

    const create_payment_json = {
      intent: 'sale',
      payer: {
        payment_method: 'paypal',
      },
      redirect_urls: {
        return_url: process.env.HOST_URL+'payments/success',
        cancel_url: process.env.HOST_URL+'payments/cancel',
      },
      transactions: [
        {
          item_list: {
            items: [
              {
                name: 'Red Sox Hat',
                sku: '001',
                price: '25.00',
                currency: 'USD',
                quantity: 1,
              },
            ],
          },
          amount: {
            currency: 'USD',
            total: '25.00',
          },
          description: 'Hat for the best team ever.',
        },
      ],
    };
    
    var paymentLink:string = 'asd';
    payment.create(create_payment_json, function (error, payment) {
      if (error) {
        throw error;
      } else {
        for (let i = 0; i < payment.links.length; i++) {
          if (payment.links[i].rel === 'approval_url') {
            console.log(payment.links[i].href);
            // return payment.links[i].href;
            paymentLink = payment.links[i].href;
            break;
          }
        }
      }
    });

    return paymentLink;
  }

  async success(query: any) {
    const payerId = query.PayerID;
    const paymentId = query.paymentId;
    const execute_payment_json = {
      payer_id: payerId,
      transactions: [
        {
          amount: {
            currency: 'USD',
            total: '25.00',
          },
        },
      ],
    };

    await payment.execute(
      paymentId,
      execute_payment_json,
      function (error, payment) {
        if (error) {
          console.log(error.response);
          throw error;
        } else {
          console.log(JSON.stringify(payment));
          return 'success';
        }
      },
    );
  }
}
