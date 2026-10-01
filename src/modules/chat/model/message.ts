import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
} from 'sequelize-typescript';
import { User } from 'src/modules/auth/models/user-models';
import { ConversationConnection } from './conversation';



@Table({
    tableName: 'messages',
    timestamps: false,
})
export class ConversationMessage extends Model {


    @ForeignKey(() => ConversationConnection)
    @Column({
        type: DataType.BIGINT,
        allowNull: false,
        field: 'conversation_id',
    })
    conversationId: bigint;

    @BelongsTo(() => ConversationConnection)
    conversation: ConversationConnection;

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        allowNull: false,
        field: 'sender_id',
    })
    senderId: string;

    @BelongsTo(() => User)
    sender: User;

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    content: string;

    @Column({
        type: DataType.ARRAY(DataType.TEXT),
        allowNull: true,
        field: 'image_urls',
    })
    imageUrl: string[];


}