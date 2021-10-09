import { Body, Controller, Get, Param, UseGuards, Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiParam, ApiTags } from '@nestjs/swagger';
import { RoleGuard } from 'src/shared/auth/role.guard';
import { UserRole } from 'src/shared/auth/user-role.enum';
import { BankPaymentRepository } from './bankPayment.repository';
import { BankPaymentService } from './bankPayment.service';
import { CreateBankPaymentDto } from './dto/create-bankPayment.dto';

@ApiTags('bankPayment')
@Controller('bankPayment')
export class BankPaymentController {
  constructor(
    private readonly bankPaymentService: BankPaymentService,
    private readonly bankPaymentRepo: BankPaymentRepository,
  ) {}

  @Get(':id')
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    required: true,
    description: 'integer for the bankPayment id',
    schema: { type: 'integer' },
  })
  @ApiExcludeEndpoint()
  @UseGuards(AuthGuard(), new RoleGuard(UserRole.ADMIN))
  async getBankPayment(@Param() bankPaymentId: any): Promise<any> {
    return this.bankPaymentRepo.findOne({ where: { id: bankPaymentId.id } });
  }

  @Get()
  @ApiBearerAuth()
  @ApiExcludeEndpoint()
  @UseGuards(AuthGuard(), new RoleGuard(UserRole.ADMIN))
  async getAllBankPayment(): Promise<any> {
    return this.bankPaymentRepo.find();
  }

  @Post()
  @ApiBearerAuth()
  @ApiExcludeEndpoint()
  @UseGuards(AuthGuard(), new RoleGuard(UserRole.ADMIN))
  createBankPayment(@Body() createBankPaymentDto: CreateBankPaymentDto): Promise<any> {
    return this.bankPaymentService.createBankPayment(createBankPaymentDto);
  }
}
