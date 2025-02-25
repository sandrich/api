import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { BankDataRepository } from 'src/bankData/bankData.repository';
import { BankDataDto } from 'src/bankData/dto/bankData.dto';
import { KycService } from 'src/services/kyc.service';
import { UserData } from 'src/userData/userData.entity';
import { UserDataRepository } from 'src/userData/userData.repository';

@Injectable()
export class BankDataService {
  constructor(
    private readonly userDataRepo: UserDataRepository,
    private readonly bankDataRepo: BankDataRepository,
    private kycService: KycService,
  ) {}

  async addBankData(userDataId: number, bankDataDto: BankDataDto): Promise<UserData> {
    const userData = await this.userDataRepo.findOne({ where: { id: userDataId }, relations: ['bankDatas'] });
    if (!userData) throw new NotFoundException(`No user data for id ${userDataId}`);

    const bankDataCheck = await this.bankDataRepo.findOne({
      iban: bankDataDto.iban,
      location: bankDataDto.location,
      name: bankDataDto.name,
    });

    if (bankDataCheck) throw new ConflictException('Bank data with duplicate key');

    const bankData = this.bankDataRepo.create({ ...bankDataDto, userData: userData });
    await this.bankDataRepo.save(bankData);

    const customer = await this.kycService.getCustomer(userData.id);

    if (!customer) {
      const newCustomer = await this.kycService.createCustomer(userData.id, bankData.name);
      userData.kycCustomerId = newCustomer.customerId;
      this.userDataRepo.save(userData);
    }

    userData.bankDatas.push(bankData);

    return userData;
  }
}
