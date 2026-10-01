// payment.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import Razorpay from 'razorpay';
import * as crypto from 'crypto';
import CoinBatch from './models/Coin';
import CoinTransaction from './models/Coinhistory';

const COIN_PACKS: Record<string, { coins: number; priceInr: number; validityDays: number }> = {
  starter: { coins: 100, priceInr: 499, validityDays: 90 },
  growth: { coins: 250, priceInr: 999, validityDays: 90 },
  pro: { coins: 600, priceInr: 1999, validityDays: 90 },
};

@Injectable()
export class PaymentService {
  private razorpay: Razorpay;

  constructor(
    @InjectModel(CoinBatch) private coinBatchModel: typeof CoinBatch,
    @InjectModel(CoinTransaction)
    private coinTransactionModel: typeof CoinTransaction,
    private sequelize: Sequelize,
  ) {
    this.razorpay = new Razorpay({
      key_id: process.env.TEST_API_KEY as string,
      key_secret: process.env.TEST_SECRET as string,
    });
  }

  // STEP 1 — frontend calls this to get an order_id before opening Razorpay checkout
  async createOrder(userId: string, dto) {
    console.log({
      key_id: process.env.TEST_API_KEY as string,
      key_secret: process.env.TEST_SECRET as string,
    });

    try {
      const pack = COIN_PACKS[dto.pack_id];
      if (!pack) throw new BadRequestException('Invalid pack_id');

      const amountInPaise = pack.priceInr * 100;

      const order = await this.razorpay.orders.create({
        amount: amountInPaise,
        currency: 'INR',
        receipt: `rcpt_${userId}_${Date.now()}`,
        notes: {
          user_id: userId,
          pack_id: dto.pack_id,
        },
      });

      return {
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        key_id: process.env.RAZORPAY_KEY_ID,
        pack: { id: dto.pack_id, coins: pack.coins, price_inr: pack.priceInr },
      };
    } catch (error) {
      console.error('Razorpay order error:', error);
      throw new BadRequestException(
        error?.error?.description || error?.message || 'Failed to create order',
      );
    }
  }

  // STEP 2 — frontend calls this after Razorpay checkout succeeds
  async verifyPayment(userId: string, dto) {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = dto;

    // 2a. Verify signature — proves the callback wasn't forged
    const expectedSignature = crypto
      .createHmac('sha256', process.env.TEST_SECRET as string)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      throw new BadRequestException('Payment signature verification failed');
    }

    // 2b. Idempotency check — a retry/duplicate call should never double-credit
    const existing = await this.coinTransactionModel.findOne({
      where: { reference_id: razorpay_payment_id },
    });
    if (existing) {
      return { message: 'Payment already processed', already_processed: true };
    }

    // 2c. Fetch the order from Razorpay itself — never trust pack_id/amount from the client
    const order = await this.razorpay.orders.fetch(razorpay_order_id);

    if (!order || order.notes?.user_id !== userId) {
      throw new BadRequestException('Order does not belong to this user');
    }

    const packId = order.notes?.pack_id as string;
    const pack = COIN_PACKS[packId];
    if (!pack) throw new BadRequestException('Invalid pack on order');

    // 2d. Confirm the payment is actually captured
    const payment = await this.razorpay.payments.fetch(razorpay_payment_id);
    if (payment.status !== 'captured') {
      throw new BadRequestException('Payment not captured');
    }

    // 2e. Credit coins — batch + ledger entry, in one transaction
    const now = new Date();
    const expiresAt = new Date(
      now.getTime() + pack.validityDays * 24 * 60 * 60 * 1000,
    );

    return this.sequelize.transaction(async (t) => {
      const batch = await this.coinBatchModel.create(
        {
          user_id: userId,
          source: 'purchase',
          pack_id: packId,
          coins_total: pack.coins,
          coins_remaining: pack.coins,
          price_paid_inr: pack.priceInr,
          issued_at: now,
          expires_at: expiresAt,
          status: 'active',
        },
        { transaction: t },
      );

      await this.coinTransactionModel.create(
        {
          user_id: userId,
          type: 'credit',
          action: 'purchase',
          coins: pack.coins,
          reference_id: razorpay_payment_id,
          batch_ids: [batch.id],
        },
        { transaction: t },
      );

      return {
        message: 'Payment verified and coins credited',
        batch_id: batch.id,
        coins_credited: pack.coins,
        expires_at: expiresAt,
      };
    });
  }


  async Getalltoken(userId: string) {
    return await this.coinBatchModel.findAll({
      where: {
        user_id: userId,
        status: 'active'
      }
    })
  }
}