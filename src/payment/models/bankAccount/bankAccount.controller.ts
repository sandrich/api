import { Body, Controller, Get, Param, UseGuards, Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiParam, ApiTags } from '@nestjs/swagger';
import { RoleGuard } from 'src/shared/auth/role.guard';
import { UserRole } from 'src/shared/auth/user-role.enum';
import { BankAccountRepository } from './bankAccount.repository';
import { BankAccountService } from './bankAccount.service';
import { CreateBankAccountDto } from './dto/create-bankAccount.dto';

@ApiTags('bankAccount')
@Controller('bankAccount')
export class BankAccountController {
  constructor(
    private readonly bankAccountService: BankAccountService,
    private readonly bankAccountRepo: BankAccountRepository,
  ) {}

  @Get(':id')
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    required: true,
    description: 'integer for the bankAccount id',
    schema: { type: 'integer' },
  })
  @ApiExcludeEndpoint()
  @UseGuards(AuthGuard(), new RoleGuard(UserRole.ADMIN))
  async getBankAccount(@Param() bankAccountId: any): Promise<any> {
    return this.bankAccountRepo.findOne({ where: { id: bankAccountId.id } });
  }

  @Get()
  @ApiBearerAuth()
  @ApiExcludeEndpoint()
  @UseGuards(AuthGuard(), new RoleGuard(UserRole.ADMIN))
  async getAllBankAccount(): Promise<any> {
    return this.bankAccountRepo.find();
  }

  @Post()
  @ApiBearerAuth()
  @ApiExcludeEndpoint()
  @UseGuards(AuthGuard(), new RoleGuard(UserRole.ADMIN))
  createBankAccount(@Body() createBankAccountDto: CreateBankAccountDto): Promise<any> {
    return this.bankAccountService.createBankAccount(createBankAccountDto);
  }
}
