import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { EntityRepository, Not, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { User, UserStatus } from './user.entity';
import { CountryRepository } from 'src/country/country.repository';
import { getManager } from 'typeorm';
import { UpdateStatusDto } from './dto/update-status.dto';
import { LanguageRepository } from 'src/language/language.repository';
import { WalletRepository } from 'src/wallet/wallet.repository';
import { KycStatus } from 'src/userData/userData.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  userRepository: any;
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    let countryObject = null;
    let languageObject = null;
    let walletObject = null;

    if (!(createUserDto.address.length == 34 || createUserDto.address.length == 42)) {
      throw new BadRequestException('address length does not match');
    }

    if (createUserDto.country) {
      countryObject = await getManager().getCustomRepository(CountryRepository).getCountry(createUserDto.country);

      createUserDto.country = countryObject.id;
    } else {
      delete createUserDto.country;
    }

    if (createUserDto.wallet) {
      walletObject = await getManager().getCustomRepository(WalletRepository).getWallet(createUserDto.wallet);

      createUserDto.wallet = walletObject.id;
    } else {
      walletObject = await getManager().getCustomRepository(WalletRepository).getWallet(1);

      createUserDto.wallet = walletObject.id;
    }

    if (createUserDto.language) {
      languageObject = await getManager().getCustomRepository(LanguageRepository).getLanguage(createUserDto.language);

      createUserDto.language = languageObject.id;
    } else {
      languageObject = await getManager().getCustomRepository(LanguageRepository).getLanguage('DE');

      createUserDto.language = languageObject.id;
    }

    const user = this.create(createUserDto);

    const refVar = String((await this.find()).length + 1001).padStart(6, '0');

    user.ref = refVar.substr(0, 3) + '-' + refVar.substr(3, 3);
    const refUser = await this.findOne({ ref: createUserDto.usedRef });

    if (user.ref == createUserDto.usedRef || !refUser) user.usedRef = '000-000';

    try {
      await this.save(user);

      createUserDto.country = countryObject;
      createUserDto.language = languageObject;
      delete user.ref;
    } catch (error) {
      throw new ConflictException(error.message);
    }

    return user;
  }

  async getAllUser(): Promise<any> {
    try {
      return this.find({ relations: ['userData', 'wallet'] });
    } catch (error) {
      throw new ConflictException(error.message);
    }
  }

  async updateStatus(user: UpdateStatusDto): Promise<any> {
    try {
      let currentUser = null;

      if (user.id) {
        currentUser = await this.findOne({ id: user.id });
      } else if (user.address) {
        currentUser = await this.findOne({ address: user.address });
      }

      if (!currentUser) throw new NotFoundException('No matching user for id found');

      currentUser.status = user.status;

      return await this.save(currentUser);
    } catch (error) {
      throw new ConflictException(error.message);
    }
  }

  async getUserInternal(addressString: string): Promise<User> {
    return this.findOne({ address: addressString });
  }

  async getRefCount(ref: string): Promise<number> {
    return this.count({ usedRef: ref });
  }

  async getRefCountActive(ref: string): Promise<number> {
    return this.count({ usedRef: ref, status: Not(UserStatus.NA) });
  }

  async updateUser(oldUser: User, newUser: UpdateUserDto): Promise<any> {
    try {
      const currentUser = await this.findOne(oldUser.id);
      if (!currentUser) throw new NotFoundException('No matching user for id found');
      const currentUserData = (await this.findOne({ where: { id: currentUser.id }, relations: ['userData'] })).userData;

      const refUser = await this.findOne({ ref: newUser.usedRef });

      if (currentUser.ref == newUser.usedRef || (!refUser && newUser.usedRef)) {
        newUser.usedRef = '000-000';
      } else {
        if (refUser) {
          const refUserData = (await this.findOne({ where: { id: refUser.id }, relations: ['userData'] })).userData;
          if (refUserData && currentUserData) {
            if (refUserData.id == currentUserData.id) newUser.usedRef = '000-000';
          }
        }
      }

      let countryObject = null;
      let languageObject = null;

      // user with kyc cannot change their data
      if (currentUserData.kycStatus != KycStatus.NA) {
        if (newUser.firstname) delete newUser.firstname;
        if (newUser.surname) delete newUser.surname;
        if (newUser.mail) delete newUser.mail;
        if (newUser.street) delete newUser.street;
        if (newUser.houseNumber) delete newUser.houseNumber;
        if (newUser.location) delete newUser.location;
        if (newUser.zip) delete newUser.zip;
        if (newUser.country) delete newUser.country;
        if (newUser.phone) delete newUser.phone;
      }

      if (newUser.country) {
        countryObject = await getManager().getCustomRepository(CountryRepository).getCountry(newUser.country);

        newUser.country = countryObject;
      }

      if (newUser.language) {
        languageObject = await getManager().getCustomRepository(LanguageRepository).getLanguage(newUser.language);

        newUser.language = languageObject;
      } else {
        languageObject = await getManager().getCustomRepository(LanguageRepository).getLanguage('EN');

        newUser.language = languageObject;
      }

      newUser.id = currentUser.id;

      await this.save(newUser);
      
      return this.findOne(currentUser.id);
    } catch (error) {
      throw new ConflictException(error.message);
    }
  }

  async updateRole(user: UpdateRoleDto): Promise<any> {
    try {
      const currentUser = await this.findOne({ id: user.id });

      if (!currentUser) throw new NotFoundException('No matching user for id found');

      currentUser.role = user.role;

      await this.save(currentUser);

      return await this.findOne({ id: user.id });
    } catch (error) {
      throw new ConflictException(error.message);
    }
  }

  async verifyUser(address: string): Promise<any> {
    const currentUser = await this.findOne({ address: address });
    if (!currentUser) throw new NotFoundException('No matching user for id found');

    const requiredFields = [
      'mail',
      'firstname',
      'surname',
      'street',
      'houseNumber',
      'location',
      'zip',
      'country',
      'phone',
    ];
    const errors = requiredFields.filter((f) => !currentUser[f]);

    return {
      result: errors.length === 0,
      errors: errors.reduce((prev, curr) => ({ ...prev, [curr]: 'missing' }), {}),
    };
  }
}
