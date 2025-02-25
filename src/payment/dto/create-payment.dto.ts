import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  IsNotEmpty,
  IsEnum,
} from 'class-validator';
import { PaymentError, PaymentStatus } from '../payment.entity';

export class CreatePaymentDto {

  @IsOptional()
  @IsInt()
  userId: number;

  @ApiProperty()
  @IsOptional()
  @Length(34, 34)
  @IsString()
  address: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  iban: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(34, 34)
  depositAddress: string;

  @ApiProperty()
  @IsNotEmpty()
  fiat: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  fiatValue: number;

  @ApiProperty()
  @IsNotEmpty()
  asset: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  assetValue: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  bankUsage: boolean;

  @IsOptional()
  @IsString()
  info: string;

  @IsOptional()
  @IsEnum(PaymentError)
  errorCode: PaymentError;

  @ApiProperty()
  @IsOptional()
  @IsEnum(PaymentStatus)
  status: PaymentStatus;
}
