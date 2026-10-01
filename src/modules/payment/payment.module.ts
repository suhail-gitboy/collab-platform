import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../auth/models/user-models';
import CoinBatch from './models/Coin';
import CoinTransaction from './models/Coinhistory';
import { HelpersModule } from 'src/helpers/helpers.module';

@Module({
  imports: [SequelizeModule.forFeature([User, CoinBatch, CoinTransaction]), HelpersModule],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule { }
