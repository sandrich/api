import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserStatus } from './user.entity';
import { UserRepository } from './user.repository';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { KycStatus, UiKycStatus } from 'src/user/models/userData/userData.entity';
import { UserDataService } from 'src/user/models/userData/userData.service';
import { LogDirection } from 'src/user/models/log/log.entity';
import { ConversionService } from 'src/shared/services/conversion.service';
import { LogService } from 'src/user/models/log/log.service';
import { CountryService } from 'src/shared/models/country/country.service';
import { LanguageService } from 'src/shared/models/language/language.service';
import { UserRole } from 'src/shared/auth/user-role.enum';

@Injectable()
export class UserService {
  constructor(
    private userRepo: UserRepository,
    private userDataService: UserDataService,
    private conversionService: ConversionService,
    private logService: LogService,
    private countryService: CountryService,
    private languageService: LanguageService
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.userRepo.createUser(createUserDto, this.languageService, this.countryService);

    delete user.signature;
    delete user.ip;
    delete user.ref;
    delete user.role;
    delete user.status;

    return user;
  }

  async getUser(userId: number, detailedUser = false): Promise<User> {
    const currentUser = await this.userRepo.findOne({
      where: { id: userId },
      relations: detailedUser ? ['userData', 'buys', 'sells'] : ['userData'],
    });

    currentUser['kycStatus'] = currentUser.userData.kycStatus;
    currentUser['uiKycStatus'] = this.getUiStatus(currentUser.userData.kycStatus);
    currentUser['refData'] = await this.getRefData(currentUser);
    currentUser['userVolume'] = await this.getUserVolume(currentUser);
    delete currentUser.userData;

    delete currentUser.signature;
    delete currentUser.ip;
    if (currentUser.role != UserRole.VIP) delete currentUser.role;

    // delete ref for inactive users
    if (currentUser.status == UserStatus.NA) delete currentUser.ref;

    return currentUser;
  }

  async updateStatus(user: UpdateStatusDto): Promise<any> {
    //TODO status ändern wenn transaction oder KYC
    return this.userRepo.updateStatus(user);
  }

  async updateUser(oldUserId: number, newUser: UpdateUserDto): Promise<any> {
    const oldUser = await this.userRepo.findOne(oldUserId);
    const user = await this.userRepo.updateUser(oldUser, newUser, this.languageService, this.countryService);

    user['refData'] = await this.getRefData(user);
    user['userVolume'] = await this.getUserVolume(user);

    const userData = (await this.userRepo.findOne({ where: { id: user.id }, relations: ['userData'] })).userData;
    user['kycStatus'] = userData.kycStatus;
    user['uiKycStatus'] = this.getUiStatus(userData.kycStatus);
    delete user.userData;
    // delete ref for inactive users
    if (user.status == UserStatus.NA) {
      delete user.ref;
    }

    delete user.signature;
    delete user.ip;
    if (user.role != UserRole.VIP) delete user.role;

    return user;
  }

  async getAllUser(): Promise<any> {
    return this.userRepo.getAllUser();
  }

  async verifyUser(address: string): Promise<any> {
    return this.userRepo.verifyUser(address);
  }

  async updateRole(user: UpdateRoleDto): Promise<any> {
    return this.userRepo.updateRole(user);
  }

  async requestKyc(userId: number): Promise<boolean> {
    const user = await this.userRepo.findOne({ where: { id: userId }, relations: ['userData'] });
    const userData = user.userData;

    return this.userDataService.requestKyc(userData.id);
  }

  async getUserVolume(user: User): Promise<any> {
    return {
      buyVolume: await this.conversionService.convertFiatCurrency(
        await this.logService.getUserVolume(user, LogDirection.fiat2asset),
        'chf',
        'eur',
      ),

      sellVolume: await this.conversionService.convertFiatCurrency(
        await this.logService.getUserVolume(user, LogDirection.asset2fiat),
        'chf',
        'eur',
      ),
    };
  }

  async getRefDataForId(userId: number): Promise<any> {
    const user = await this.userRepo.findOne(userId);
    return this.getRefData(user);
  }

  async getRefData(user: User): Promise<any> {
    return {
      ref: user.status == UserStatus.NA ? undefined : user.ref,
      refCount: await this.userRepo.getRefCount(user.ref),
      refCountActive: await this.userRepo.getRefCountActive(user.ref),
      refVolume: await this.conversionService.convertFiatCurrency(
        await this.logService.getRefVolume(user.ref),
        'chf',
        'eur',
      ),
    };
  }

  getUiStatus(kycStatus: KycStatus): UiKycStatus {
    switch (kycStatus) {
      case KycStatus.NA:
        return UiKycStatus.KYC_NO;
      case KycStatus.WAIT_CHAT_BOT:
      case KycStatus.WAIT_ADDRESS:
      case KycStatus.WAIT_ONLINE_ID:
        return UiKycStatus.KYC_PENDING;

      case KycStatus.WAIT_MANUAL:
        return UiKycStatus.KYC_PROV;

      case KycStatus.COMPLETED:
        return UiKycStatus.KYC_COMPLETED;

      default:
        return UiKycStatus.KYC_NO;
    }
  }
}