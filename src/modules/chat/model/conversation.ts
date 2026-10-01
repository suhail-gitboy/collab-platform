import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
} from 'sequelize-typescript';

import { User } from 'src/modules/auth/models/user-models';
import { ConversationMessage } from './message';
@Table({
    tableName: 'conversations',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
})
export class ConversationConnection extends Model {

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        allowNull: false,
        field: 'user1_id',
    })
    user1Id: string;

    @BelongsTo(() => User, {
        foreignKey: 'user1Id',
        as: 'user1',
    })
    user1: User;

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        allowNull: false,
        field: 'user2_id',
    })
    user2Id: string;

    @BelongsTo(() => User, {
        foreignKey: 'user2Id',
        as: 'user2',
    })
    user2: User;

    @ForeignKey(() => ConversationMessage)
    @Column({
        type: DataType.BIGINT,
        allowNull: true,
        field: 'last_message_id',
    })
    lastMessageId: bigint;

    @BelongsTo(() => ConversationMessage, {
        foreignKey: 'lastMessageId',
        as: 'lastMessage',
    })
    lastMessage: ConversationMessage;
}