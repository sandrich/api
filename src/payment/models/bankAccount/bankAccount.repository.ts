import { ConflictException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { BankAccount } from './bankAccount.entity';
import { CreateBankAccountDto } from './dto/create-bankAccount.dto';

@EntityRepository(BankAccount)
export class BankAccountRepository extends Repository<BankAccount> {
  async createBankAccount(createBankAccountDto: CreateBankAccountDto): Promise<any> {
    const bankAccount = this.create(createBankAccountDto);

    try {
      await this.save(bankAccount);
    } catch (error) {
      throw new ConflictException(error.message);
    }

    return bankAccount;
  }

  async getAllBankAccount(): Promise<any> {
    try {
      return await this.find();
    } catch (error) {
      throw new ConflictException(error.message);
    }
  }
}
