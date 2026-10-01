import { InjectModel } from '@nestjs/sequelize';
import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsException,
} from '@nestjs/websockets';

import { ConversationConnection } from './model/conversation';
import { ConversationMessage } from './model/message';
import { Op, where } from 'sequelize';
import { NotFoundError } from 'rxjs';
import { NotFoundException } from '@nestjs/common';
import { Server, Socket } from "socket.io"

interface OnlineUser {
    userid: any;
    clientid: string;
}
@WebSocketGateway({
    cors: {
        origin: '*',
    },
})

export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server
    constructor(@InjectModel(ConversationConnection) private mutualConnection: typeof ConversationConnection, @InjectModel(ConversationMessage) private message: typeof ConversationMessage) {

    }

    onlineuser: OnlineUser[] = []
    userId: any

    handleConnection(client: any, ...args: any[]) {
        const userId = client.data.userId
        const existenceUser = this.onlineuser.find((user) => user.userid == userId)
        if (!existenceUser) {
            this.onlineuser.push({
                clientid: client.id,
                userid: userId
            })
        }
        console.log(this.onlineuser);
    }


    handleDisconnect(client: any) {
        this.onlineuser = this.onlineuser.filter((data) => data.clientid != client.id)
        console.log(this.onlineuser);


    }


    // @SubscribeMessage('onlineUser')
    // handleOnlineuser(
    //     @ConnectedSocket() client: Socket,
    //     @MessageBody() message: any,
    // ) {
    //     const { user } = JSON.parse(message)
    //     console.log(user);


    // }
    @SubscribeMessage('newmessage')
    async handleNewMessage(
        @ConnectedSocket() client: Socket,
        @MessageBody() message,
    ) {
        const senderId = client?.data?.userId;
        console.log("sender", senderId);

        if (!senderId) {
            throw new WsException('userId not found on socket');
        }

        const { text, images, recipientId } = JSON.parse(message);


        const whereClause = {
            [Op.or]: [
                { user1Id: recipientId, user2Id: senderId },
                { user1Id: senderId, user2Id: recipientId },
            ],
        };

        // console.log('whereClause:', JSON.stringify(whereClause, null, 2));


        const [conversation] = await this.mutualConnection.findOrCreate({
            where: whereClause,
            defaults: {
                user1Id: senderId,
                user2Id: recipientId,
            },
        });

        const createdMessage = await this.message.create({
            conversationId: conversation.id,
            senderId: senderId,
            content: text,
            imageUrl: images
        });

        // update conversation preview timestamp
        await this.mutualConnection.update(
            { lastMessageId: createdMessage.id },
            {
                where: {
                    id: conversation.id

                }
            }



        )
        const payload = {
            id: createdMessage.id,
            conversationId: conversation.id,
            senderId,
            content: createdMessage.content,
            imageUrl: createdMessage.imageUrl,

        };

        // emit to the recipient, if they're online
        const recipientSocketId = this.onlineuser.find(
            (user) => user.userid === recipientId,
        )

        if (recipientSocketId) {
            this.server.to(recipientSocketId.clientid).emit('newmessage', payload);
        }



        return { status: 'sent', messageId: createdMessage.id };
    }

    @SubscribeMessage('deletemessage')
    async handleDeleteMessage(
        @ConnectedSocket() client: Socket,
        @MessageBody() message,
    ) {
        const senderId = client?.data?.userId;

        if (!senderId) {
            throw new WsException('userId not found on socket');
        }

        const { messageId } = JSON.parse(message);

        const targetMessage = await this.message.findOne({
            where: { id: messageId }
        });

        if (!targetMessage) {
            throw new WsException('Message not found');
        }

        // only the original sender can delete it
        if (targetMessage.senderId !== senderId) {
            throw new WsException('Not authorized to delete this message');
        }

        // soft delete
        await this.message.update(
            { isDeleted: true, content: null, imageUrl: null },
            { where: { id: messageId } }
        );

        const conversation = await this.mutualConnection.findOne({
            where: { id: targetMessage.conversationId }
        });

        // if the deleted message was the last message, fall back to the previous one
        if (conversation && conversation.lastMessageId === messageId) {
            const previousMessage = await this.message.findOne({
                where: {
                    conversationId: targetMessage.conversationId,
                    isDeleted: false
                },
                order: [['createdAt', 'DESC']]
            });

            await this.mutualConnection.update(
                { lastMessageId: previousMessage ? previousMessage.id : null },
                { where: { id: conversation.id } }
            );
        }

        const payload = {
            messageId,
            conversationId: targetMessage.conversationId,
            deletedBy: senderId,
        };

        // notify the other participant if online
        const recipientId =
            conversation?.user1Id === senderId ? conversation?.user2Id : conversation?.user1Id;

        const recipientSocket = this.onlineuser.find(
            (user) => user.userid === recipientId,
        );

        if (recipientSocket) {
            this.server.to(recipientSocket.clientid).emit('messagedeleted', payload);
        }

        return { status: 'deleted', messageId };
    }

    @SubscribeMessage('typing')
    async handleTyping(
        @ConnectedSocket() client: Socket,
        @MessageBody() message,
    ) {
        const senderId = client?.data?.userId;

        if (!senderId) {
            throw new WsException('userId not found on socket');
        }

        const { recipientId, conversationId } = JSON.parse(message);

        const recipientSocket = this.onlineuser.find(
            (user) => user.userid === recipientId,
        );

        if (recipientSocket) {
            this.server.to(recipientSocket.clientid).emit('usertyping', {
                senderId,
                conversationId,
            });
        }
    }

    @SubscribeMessage('stoptyping')
    async handleStopTyping(
        @ConnectedSocket() client: Socket,
        @MessageBody() message,
    ) {
        const senderId = client?.data?.userId;

        if (!senderId) {
            throw new WsException('userId not found on socket');
        }

        const { recipientId, conversationId } = JSON.parse(message);

        const recipientSocket = this.onlineuser.find(
            (user) => user.userid === recipientId,
        );

        if (recipientSocket) {
            this.server.to(recipientSocket.clientid).emit('userstoppedtyping', {
                senderId,
                conversationId,
            });
        }
    }
}