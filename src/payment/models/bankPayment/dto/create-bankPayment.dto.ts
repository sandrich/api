import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { BankPaymentType } from '../bankPayment.entity';

export class CreateBankPaymentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  bankName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(BankPaymentType)
  type: BankPaymentType;
}
