import { Module } from '@nestjs/common';
import { BusinessSideService } from './business-side.service';
import { BusinessSideController } from './business-side.controller';
import BusinessProfile from './model/busines.modelmain';
import { User } from '../auth/models/user-models';
import { HelpersService } from 'src/helpers/helpers.service';
import { HelpersModule } from 'src/helpers/helpers.module';
import { SequelizeModule } from '@nestjs/sequelize';
import CreatorProfile from '../creator_profile/model/model';

@Module({
  imports: [SequelizeModule.forFeature([BusinessProfile, User, CreatorProfile]), HelpersModule],
  controllers: [BusinessSideController],
  providers: [BusinessSideService, HelpersService],
})
export class BusinessSideModule { }
