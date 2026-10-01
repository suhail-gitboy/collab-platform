import { Module } from '@nestjs/common';
import { SocialaccountService } from './socialaccount.service';
import { SocialaccountController } from './socialaccount.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { CreatorSocialAccount } from './model/model';
import { HelpersModule } from 'src/helpers/helpers.module';
import { EncryptionService } from 'src/helpers/Encryptor';
import { User } from '../auth/models/user-models';
import CreatorProfile from '../creator_profile/model/model';
CreatorSocialAccount

@Module({
  imports: [
    HelpersModule,

    SequelizeModule.forFeature([
      CreatorSocialAccount, User, CreatorProfile
    ])],
  controllers: [SocialaccountController],
  providers: [SocialaccountService],
})
export class SocialaccountModule { }
