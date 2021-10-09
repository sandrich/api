import { Injectable } from '@nestjs/common';
import { BankPaymentRepository } from './bankPayment.repository';
import { CreateBankPaymentDto } from './dto/create-bankPayment.dto';

@Injectable()
export class BankPaymentService {
  constructor(private bankPaymentRepository: BankPaymentRepository) {}

  async createBankPayment(createBankPaymentDto: CreateBankPaymentDto): Promise<any> {
    return this.bankPaymentRepository.createBankPayment(createBankPaymentDto);
  }
}
