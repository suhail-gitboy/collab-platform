import { Module } from '@nestjs/common';
import { HelpersService } from './helpers.service';
import { EncryptionService } from './Encryptor';
import { SequelizeModule } from '@nestjs/sequelize';
import CreatorProfile from 'src/modules/creator_profile/model/model';
import BusinessProfile from 'src/modules/business-side/model/busines.modelmain';

@Module({
  imports: [SequelizeModule.forFeature([CreatorProfile, BusinessProfile])],
  providers: [HelpersService, EncryptionService],
  exports: [HelpersService, EncryptionService]
})
export class HelpersModule { }
