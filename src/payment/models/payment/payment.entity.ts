import { Asset } from 'src/shared/models/asset/asset.entity';
import { Fiat } from 'src/shared/models/fiat/fiat.entity';
import { Buy } from 'src/user/models/buy/buy.entity';
import { Log } from 'src/user/models/log/log.entity';
import { Sell } from 'src/user/models/sell/sell.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

export enum PaymentType {
  BUY = 'Buy',
  SELL = 'Sell',
}

export enum PaymentError {
  NA = 'NA',
  IBAN = 'IBAN',
  BANKUSAGE = 'Bankusage',
  FIAT = 'Fiat',
  ASSET = 'Asset',
  KYC = 'KYC',
  ACCOUNTCHECK = 'Account-check',
  NAMECHECK = 'Name-check',
  USERDATA = 'UserData',
}

export enum PaymentStatus {
  UNPROCESSED = 'Unprocessed',
  PROCESSED = 'Processed',
  REPAYMENT = 'Repayment',
  CANCELED = 'Canceled',
}

@Entity()
export abstract class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 256, nullable: true })
  address: string;

  @ManyToOne(() => Fiat, { eager: true })
  fiat: Fiat;

  @Column({ type: 'float', nullable: true })
  btcValue: number;

  @Column({ type: 'float', nullable: true })
  fiatInCHF: number;

  @ManyToOne(() => Asset, { eager: true })
  asset: Asset;

  @Column({ type: 'datetime2', nullable: true })
  received: Date;

  @Column({ default: PaymentStatus.UNPROCESSED, length: 256 })
  status: PaymentStatus;

  @Column({ length: 256, nullable: true })
  info: string;

  @Column({ default: PaymentError.NA, length: 256 })
  errorCode: PaymentError;

  @Column({ default: false })
  accepted: boolean;

  @OneToMany(() => Log, (log) => log.payment)
  logs: Log[];

  //TODO Batch referenzieren

  //TODO bankAccount referenzieren

  @UpdateDateColumn()
  updated: Date;

  @CreateDateColumn()
  created: Date;
}

@Entity()
export class BuyPayment extends Payment {
  @Column({ type: 'float', nullable: true })
  fiatValue: number;

  @Column({ length: 256, nullable: true })
  iban: string;

  @Column({ length: 256, unique: true })
  bankTransactionId: string;

  @Column({ type: 'float', nullable: true })
  originFiatValue: number;

  @ManyToOne(() => Fiat, { eager: true })
  originFiat: Fiat;

  @ManyToOne(() => Buy)
  buy: Buy;
}


@Entity()
export class SellPayment extends Payment {
  @Column({ length: 256, nullable: true })
  depositAddress: string;

  @Column({ type: 'float', nullable: true })
  assetValue: number;

  @ManyToOne(() => Sell)
  sell: Sell;
}