import { NotFoundException, BadRequestException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { CreateSellPaymentDto } from './dto/create-sell-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaymentError, PaymentStatus } from './payment.entity';
import { SellPayment } from './payment-sell.entity';
import { FiatRepository } from 'src/fiat/fiat.repository';
import { getManager } from 'typeorm';
import { AssetRepository } from 'src/asset/asset.repository';

@EntityRepository(SellPayment)
export class SellPaymentRepository extends Repository<SellPayment> {
  async createPayment(createPaymentDto: CreateSellPaymentDto): Promise<any> {

    let assetObject = null;
    let fiatObject = null;
    const assetIndex = null;

    if (createPaymentDto.fiat) {
      try {
        fiatObject = await getManager()
          .getCustomRepository(FiatRepository)
          .getFiat(createPaymentDto.fiat);

        createPaymentDto.fiat = fiatObject.id;
      } catch {
        createPaymentDto.info = 'Wrong Fiat: ' + createPaymentDto.fiat;
        createPaymentDto.fiat = null;
        createPaymentDto.errorCode = PaymentError.FIAT;
      }
    } else {
      createPaymentDto.info = 'Wrong Fiat: ' + createPaymentDto.fiat;
      createPaymentDto.fiat = null;
      createPaymentDto.errorCode = PaymentError.FIAT;
    }

    if (createPaymentDto.asset) {
      try {
        assetObject = await getManager()
          .getCustomRepository(AssetRepository)
          .getAsset(assetIndex);

        if (assetObject.buyable == 1) {
          createPaymentDto.asset = assetObject.id;
        } else {
          createPaymentDto.info =
            'Asset not buyable: ' + createPaymentDto.asset;
          createPaymentDto.asset = null;
          createPaymentDto.errorCode = PaymentError.ASSET;
        }
      } catch {
        createPaymentDto.info = 'Wrong Asset: ' + createPaymentDto.asset;
        createPaymentDto.asset = null;
        createPaymentDto.errorCode = PaymentError.ASSET;
      }
    } else {
      createPaymentDto.info = 'Wrong Asset: ' + createPaymentDto.asset;
      createPaymentDto.asset = null;
      createPaymentDto.errorCode = PaymentError.ASSET;
    }

    const payment = this.create(createPaymentDto);

    if (payment) {
      await this.save(payment);
      payment.fiat = fiatObject;
      payment.asset = assetObject;
    }
    return payment;
  }

  async updatePayment(payment: UpdatePaymentDto): Promise<any> {
    const currentPayment = await this.findOne({ id: payment.id });

    if (!currentPayment)
      throw new NotFoundException('No matching payment for id found');

    currentPayment.status = payment.status;

    await this.save(currentPayment);

    const newPayment = await this.findOne({ id: payment.id });

    if (newPayment) {
      if (newPayment.fiat)
        newPayment.fiat = await getManager()
          .getCustomRepository(FiatRepository)
          .getFiat(newPayment.fiat);
      if (newPayment.asset)
        newPayment.asset = await getManager()
          .getCustomRepository(AssetRepository)
          .getAsset(newPayment.asset);
    }

    return newPayment;
  }

  async getAllPayment(): Promise<any> {
    const payment = await this.find();

    if (payment) {
      for (let a = 0; a < payment.length; a++) {
        if (payment[a].fiat)
          payment[a].fiat = (
            await getManager()
              .getCustomRepository(FiatRepository)
              .getFiat(payment[a].fiat)
          ).name;
        if (payment[a].asset)
          payment[a].asset = (
            await getManager()
              .getCustomRepository(AssetRepository)
              .getAsset(payment[a].asset)
          ).name;
      }
    }

    return payment;
  }

  async getPayment(id: any): Promise<any> {
    if (!isNaN(id.key)) {
      const payment = await this.findOne({ id: id.key });

      if (!payment)
        throw new NotFoundException('No matching payment for id found');

      if (payment.fiat)
        payment.fiat = await getManager()
          .getCustomRepository(FiatRepository)
          .getFiat(payment.fiat);
      if (payment.asset)
        payment.asset = await getManager()
          .getCustomRepository(AssetRepository)
          .getAsset(payment.asset);

      return payment;
    } else if (!isNaN(id)) {
      const payment = await this.findOne({ id: id });

      if (!payment)
        throw new NotFoundException('No matching payment for id found');

      if (payment.fiat)
        payment.fiat = await getManager()
          .getCustomRepository(FiatRepository)
          .getFiat(payment.fiat);
      if (payment.asset)
        payment.asset = await getManager()
          .getCustomRepository(AssetRepository)
          .getAsset(payment.asset);

      return payment;
    }
    throw new BadRequestException('id must be a number');
  }

  async getPaymentInternal(id: any): Promise<any> {
    if (id.key) {
      if (!isNaN(id.key)) {
        const payment = await this.findOne({ id: id.key });

        return payment;
      }
    } else if (!isNaN(id)) {
      const payment = await this.findOne({ id: id });

      return payment;
    }
    throw new BadRequestException('id must be a number');
  }

  async getUnprocessedPayment(): Promise<any> {
    const payment = await this.find({ status: PaymentStatus.UNPROCESSED });

    if (payment) {
      for (let a = 0; a < payment.length; a++) {
        if (payment[a].fiat)
          payment[a].fiat = (
            await getManager()
              .getCustomRepository(FiatRepository)
              .getFiat(payment[a].fiat)
          ).name;
        if (payment[a].asset)
          payment[a].asset = (
            await getManager()
              .getCustomRepository(AssetRepository)
              .getAsset(payment[a].asset)
          ).name;
      }
    }

    return payment;
  }
}
