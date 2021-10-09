import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from 'src/shared/shared.module';
import { BankAccountController } from './models/bankAccount/bankAccount.controller';
import { BankAccountRepository } from './models/bankAccount/bankAccount.repository';
import { BankAccountService } from './models/bankAccount/bankAccount.service';
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
    TypeOrmModule.forFeature([BuyPaymentRepository, SellPaymentRepository, BatchRepository, BankAccountRepository]),
    SharedModule,
  ],
  controllers: [PaymentController, BatchController, BankAccountController],
  providers: [PaymentService, BatchService, ExchangeService, BankAccountService],
  exports: [PaymentService, BankAccountService],
})
export class PaymentModule {}
