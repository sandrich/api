import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from 'src/shared/shared.module';
import { BankPaymentController } from './models/bankPayment/bankPayment.controller';
import { BankPaymentRepository } from './models/bankPayment/bankPayment.repository';
import { BankPaymentService } from './models/bankPayment/bankPayment.service';
import { BatchController } from './models/batch/batch.controller';
import { BatchRepository } from './models/batch/batch.repository';
import { BatchService } from './models/batch/batch.service';
import { BuyPaymentRepository } from './models/payment/payment-buy.repository';
import { SellPaymentRepository } from './models/payment/payment-sell.repository';
import { PaymentController } from './models/payment/payment.controller';
import { PaymentService } from './models/payment/payment.service';
import { ExchangeService } from './services/exchange.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([BuyPaymentRepository, SellPaymentRepository, BatchRepository, BankPaymentRepository]),
    SharedModule,
  ],
  controllers: [PaymentController, BatchController, BankPaymentController],
  providers: [PaymentService, BatchService, ExchangeService, BankPaymentService],
  exports: [PaymentService, BankPaymentService],
})
export class PaymentModule {}
