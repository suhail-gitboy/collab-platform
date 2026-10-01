import { Module } from '@nestjs/common';
import { ChatGateway } from './chat-gateway';
import { ChatService } from './chat.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../auth/models/user-models';
import { ConversationConnection } from './model/conversation';
import { ConversationMessage } from './model/message';
import { ChatController } from './chat.controller';

@Module({
    imports: [SequelizeModule.forFeature([User, ConversationConnection, ConversationMessage])],
    providers: [ChatGateway, ChatService],
    controllers: [ChatController]
})
export class ChatModule {

}
