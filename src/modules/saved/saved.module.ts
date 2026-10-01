import { Module } from '@nestjs/common';
import { SavedService } from './saved.service';
import { SavedController } from './saved.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { SavedRelation } from './models/savemodel';
import CreatorProfile from '../creator_profile/model/model';
import BusinessProfile from '../business-side/model/busines.modelmain';
import { HelpersService } from 'src/helpers/helpers.service';
import { HelpersModule } from 'src/helpers/helpers.module';

@Module({
  imports: [SequelizeModule.forFeature([SavedRelation, CreatorProfile, BusinessProfile]), HelpersModule],

  controllers: [SavedController],
  providers: [SavedService, HelpersService],
})
export class SavedModule { }
