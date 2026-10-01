import { Module } from '@nestjs/common';
import { CollaborationFlowService } from './collaboration-flow.service';
import { CollaborationFlowController } from './collaboration-flow.controller';
import sequelize, { Sequelize } from 'sequelize';
import { HelpersModule } from 'src/helpers/helpers.module';
import { HelpersService } from 'src/helpers/helpers.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../auth/models/user-models';
import { Campaign } from './models/campaign';
import { CollaborationRequest } from './models/collaboration_request';

@Module({
  imports: [SequelizeModule.forFeature([User, Campaign, CollaborationRequest])],
  controllers: [CollaborationFlowController, HelpersModule],
  providers: [CollaborationFlowService, HelpersService],
})
export class CollaborationFlowModule { }
