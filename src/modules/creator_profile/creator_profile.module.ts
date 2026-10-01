import { Module } from '@nestjs/common';
import { CreatorProfileService } from './creator_profile.service';
import { CreatorProfileController } from './creator_profile.controller';
import { HelpersService } from 'src/helpers/helpers.service';
import { SequelizeModule } from '@nestjs/sequelize';
import CreatorProfile from './model/model';
import { HelpersModule } from 'src/helpers/helpers.module';
import { CreatorCategory } from './model/creatorcategory';
import { CreatorLanguage } from './model/language';
import { CreatorSocialAccount } from './model/media.types';
import { User } from '../auth/models/user-models';
import BusinessProfile from '../business-side/model/busines.modelmain';
import { RedisModule } from 'src/redis/redis.module';
import { RedisService } from 'src/redis/redis.service';
@Module({
  imports: [RedisModule, HelpersModule, SequelizeModule.forFeature([BusinessProfile, CreatorProfile, User, CreatorCategory, CreatorLanguage, CreatorSocialAccount])],
  controllers: [CreatorProfileController],
  providers: [RedisService, CreatorProfileService, HelpersService],
})
export class CreatorProfileModule { }
