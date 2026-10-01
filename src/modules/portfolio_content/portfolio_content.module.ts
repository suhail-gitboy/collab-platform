import { Module } from '@nestjs/common';
import { PortfolioContentService } from './portfolio_content.service';
import { PortfolioContentController } from './portfolio_content.controller';
import { HelpersService } from 'src/helpers/helpers.service';
import { HelpersModule } from 'src/helpers/helpers.module';
import { SequelizeModule } from '@nestjs/sequelize';
import PortfolioContent from './model/model.portfolio';
import { User } from '../auth/models/user-models';
import CreatorProfile from '../creator_profile/model/model';
import BusinessProfile from '../business-side/model/busines.modelmain';

@Module({
  imports: [HelpersModule, SequelizeModule.forFeature([BusinessProfile, PortfolioContent, User, CreatorProfile])],
  controllers: [PortfolioContentController],
  providers: [PortfolioContentService, HelpersService],
})
export class PortfolioContentModule { }
