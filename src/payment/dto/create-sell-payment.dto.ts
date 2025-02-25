import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  IsNotEmpty,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { PaymentError, PaymentStatus } from '../payment.entity';

export class CreateSellPaymentDto {

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
  fiat: any;

  @ApiProperty()
  @IsNotEmpty()
  asset: any;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  assetValue: number;

  @IsOptional()
  @IsString()
  info: string;

  @IsOptional()
  @IsEnum(PaymentError)
  errorCode: PaymentError;

  @IsOptional()
  @IsBoolean()
  accepted: boolean

  @IsOptional()
  @IsEnum(PaymentStatus)
  status: PaymentStatus;
}
