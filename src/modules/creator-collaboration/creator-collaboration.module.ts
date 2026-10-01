import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { CreatorCollaborationService } from './post.service';
import { CreatorCollaborationController } from './creator-collaboration.controller';

import { User } from '../auth/models/user-models';
import CollaborationPost from './Models/Creator-collaboration.request';
import CollaborationResponse from './Models/Creator-collaboration';

import { HelpersModule } from 'src/helpers/helpers.module';

import BusinessProfile from '../business-side/model/busines.modelmain';
import CreatorProfile from '../creator_profile/model/model';

@Module({
  imports: [
    HelpersModule,

    SequelizeModule.forFeature([
      User,
      CollaborationPost,
      CollaborationResponse,
      BusinessProfile,
      CreatorProfile,
    ]),
  ],

  controllers: [
    CreatorCollaborationController,
  ],

  providers: [
    CreatorCollaborationService,
  ],
})
export class CreatorCollaborationModule { }