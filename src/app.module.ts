import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { UserController } from './user/user.controller';
import { BuyController } from './buy/buy.controller';
import { SellController } from './sell/sell.controller';
import { AssetController } from './asset/asset.controller';
import { FiatController } from './fiat/fiat.controller';
import { WalletController } from './wallet/wallet.controller';
import { DepositController } from './deposit/deposit.controller';
import { CountryController } from './country/country.controller';
import { AuthController } from './auth/auth.controller';
import { AllDataController } from './all/all.controller';
import { UserService } from './user/user.service';
import { BuyService } from './buy/buy.service';
import { SellService } from './sell/sell.service';
import { AssetService } from './asset/asset.service';
import { FiatService } from './fiat/fiat.service';
import { WalletService } from './wallet/wallet.service';
import { DepositService } from './deposit/deposit.service';
import { CountryService } from './country/country.service';
import { AllDataService } from './all/all.service';
import { AuthService } from './auth/auth.service';
import { UserRepository } from './user/user.repository';
import { AssetRepository } from './asset/asset.repository';
import { WalletRepository } from './wallet/wallet.repository';
import { DepositRepository } from './deposit/deposit.repository';
import { CountryRepository } from './country/country.repository';
import { FiatRepository } from './fiat/fiat.repository';
import { BuyRepository } from './buy/buy.repository';
import { SellRepository } from './sell/sell.repository';
import { JwtStrategy } from './auth/jwt.strategy';
import { StatisticController } from './statistic/statistic.controller';
import { StatisticService } from './statistic/statistic.service';
import { LogController } from './log/log.controller';
import { LogService } from './log/log.service';
import { LogRepository } from './log/log.repository';
import { SellPaymentRepository } from './payment/payment-sell.repository';
import { BuyPaymentRepository } from './payment/payment-buy.repository';
import { PaymentController } from './payment/payment.controller';
import { PaymentService } from './payment/payment.service';
import { LanguageService } from './language/language.service';
import { LanguageRepository } from './language/language.repository';
import { LanguageController } from './language/language.controller';
import { UserDataRepository } from './userData/userData.repository';
import { UserDataController } from './userData/userData.controller';
import { UserDataService } from './userData/userData.service';
import { RefRepository } from './referral/ref.repository';
import { RefController } from './referral/ref.controller';
import { RefService } from './referral/ref.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './services/mail.service';
import { KycService } from './services/kyc.service';
import { BankDataRepository } from './bankData/bankData.repository';
import { BankDataService } from './bankData/bankData.service';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulerService } from './services/scheduler.service';
import { BatchRepository } from './batch/batch.repository';
import { BatchController } from './batch/batch.controller';
import { BatchService } from './batch/batch.service';
import { CfpService } from './services/cfp.service';
import { AinModule } from './ain/ain.module';
import { SharedModule } from './shared/shared.module';
import { KycFile } from './userData/kycFile.entity';
@Module({
  imports: [
    ConfigModule.forRoot(),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        secure: false,
        auth: {
          type: 'OAuth2',
          user: process.env.MAIL_USER,
          clientId: process.env.MAIL_CLIENT_ID,
          clientSecret: process.env.MAIL_CLIENT_SECRET,
          refreshToken: process.env.MAIL_REFRESH_TOKEN,
        },
        tls: {
          rejectUnauthorized: false,
        },
      },
      defaults: {
        from: '"DFX.swiss" <' + process.env.MAIL_USER + '>',
      },
    }),
    PassportModule.register({ defaultStrategy: 'jwt', session: true }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: 172800,
      },
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: process.env.SQL_HOST,
      port: Number.parseInt(process.env.SQL_PORT),
      username: process.env.SQL_USERNAME,
      password: process.env.SQL_PASSWORD,
      database: process.env.SQL_DB,
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: process.env.SQL_SYNCHRONIZE === 'true',
      migrationsRun: process.env.SQL_MIGRATE === 'true',
      migrations: ['migration/*.js'],
      cli: {
        migrationsDir: 'migration',
      },
    }),
    TypeOrmModule.forFeature([
      UserDataRepository,
      UserRepository,
      BuyRepository,
      SellRepository,
      LogRepository,
      AssetRepository,
      WalletRepository,
      DepositRepository,
      CountryRepository,
      FiatRepository,
      BuyPaymentRepository,
      SellPaymentRepository,
      LanguageRepository,
      BankDataRepository,
      RefRepository,
      BatchRepository,
      KycFile
    ]),
    SharedModule,
    AinModule,
  ],
  controllers: [
    AppController,
    AuthController,
    UserController,
    BuyController,
    SellController,
    LogController,
    AssetController,
    WalletController,
    DepositController,
    CountryController,
    FiatController,
    StatisticController,
    PaymentController,
    AllDataController,
    LanguageController,
    UserDataController,
    RefController,
    AuthController,
    BatchController,
  ],
  providers: [
    UserService,
    AuthService,
    BuyService,
    SellService,
    LogService,
    AssetService,
    WalletService,
    DepositService,
    CountryService,
    FiatService,
    JwtStrategy,
    StatisticService,
    PaymentService,
    AllDataService,
    LanguageService,
    UserDataService,
    BankDataService,
    RefService,
    AuthService,
    MailService,
    KycService,
    SchedulerService,
    BatchService,
    CfpService,
  ],
  exports: [],
})
export class AppModule {}
