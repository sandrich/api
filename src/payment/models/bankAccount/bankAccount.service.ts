import { Injectable } from '@nestjs/common';
import { BankAccountRepository } from './bankAccount.repository';
import { CreateBankAccountDto } from './dto/create-bankAccount.dto';

@Injectable()
export class BankAccountService {
  constructor(private bankAccountRepository: BankAccountRepository) {}

  async createBankAccount(createBankAccountDto: CreateBankAccountDto): Promise<any> {
    return this.bankAccountRepository.createBankAccount(createBankAccountDto);
  }
}
