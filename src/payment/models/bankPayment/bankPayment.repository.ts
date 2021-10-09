import { ConflictException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { BankPayment } from './bankPayment.entity';
import { CreateBankPaymentDto } from './dto/create-bankPayment.dto';

@EntityRepository(BankPayment)
export class BankPaymentRepository extends Repository<BankPayment> {
  async createBankPayment(createBankPaymentDto: CreateBankPaymentDto): Promise<any> {
    const bankPayment = this.create(createBankPaymentDto);

    try {
      await this.save(bankPayment);
    } catch (error) {
      throw new ConflictException(error.message);
    }

    return bankPayment;
  }

  async getAllBankPayment(): Promise<any> {
    try {
      return await this.find();
    } catch (error) {
      throw new ConflictException(error.message);
    }
  }
}
