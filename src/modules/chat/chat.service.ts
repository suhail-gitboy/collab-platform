import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ConversationConnection } from './model/conversation';
import { ConversationMessage } from './model/message';

@Injectable()
export class ChatService {

    constructor(@InjectModel(ConversationConnection) private mutualConnection: typeof ConversationConnection, @InjectModel(ConversationMessage) private message: ConversationMessage) {

    }
    Sendmessage() {

    }

}
