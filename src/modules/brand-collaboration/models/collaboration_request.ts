import {
    Table,
    Column,
    Model,
    DataType,
    Default,
    AllowNull,
    ForeignKey,
    BelongsTo,
} from 'sequelize-typescript';


import { Campaign } from './campaign';
import CreatorProfile from 'src/modules/creator_profile/model/model';
import BusinessProfile from 'src/modules/business-side/model/busines.modelmain';
import { CollaborationType, InitiatorType, RequestStatus } from 'src/types/types.common';

@Table({
    tableName: 'collaboration_requests',
    timestamps: false,
})
export class CollaborationRequest extends Model {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    })
    declare id: string;

    // Nullable: direct pitches skip the campaign entirely
    @ForeignKey(() => Campaign)
    @Column({
        type: DataType.UUID,
    })
    declare campaignId: string | null;

    @BelongsTo(() => Campaign, { onDelete: 'SET NULL' })
    campaign: Campaign;

    @ForeignKey(() => CreatorProfile)
    @AllowNull(false)
    @Column({
        type: DataType.UUID,
    })
    declare creatorId: string;

    @BelongsTo(() => CreatorProfile, { onDelete: 'CASCADE' })
    creator: CreatorProfile;

    @ForeignKey(() => BusinessProfile)
    @AllowNull(false)
    @Column({
        type: DataType.UUID,
    })
    declare businessId: string;

    @BelongsTo(() => BusinessProfile, { onDelete: 'CASCADE' })
    business: BusinessProfile;

    @AllowNull(false)
    @Column({
        type: DataType.ENUM(...Object.values(InitiatorType)),
    })
    declare initiatedBy: InitiatorType;

    @AllowNull(false)
    @Column({
        type: DataType.ENUM(...Object.values(CollaborationType)),
    })
    declare collaborationType: CollaborationType;

    @Column({
        type: DataType.DECIMAL(10, 2),
    })
    declare proposedBudget: number;

    @AllowNull(false)
    @Default('INR')
    @Column({
        type: DataType.STRING(3),
    })
    declare currency: string;

    @Column({
        type: DataType.TEXT,
    })
    declare message: string;

    @AllowNull(false)
    @Default(RequestStatus.PENDING)
    @Column({
        type: DataType.ENUM(...Object.values(RequestStatus)),
    })
    declare status: RequestStatus;

    @Column({
        type: DataType.DATE,
    })
    declare respondedAt: Date;

    @AllowNull(false)
    @Column({
        type: DataType.DATE,
        defaultValue: DataType.NOW,
    })
    declare createdAt: Date;

    @AllowNull(false)
    @Column({
        type: DataType.DATE,
        defaultValue: DataType.NOW,
    })
    declare updatedAt: Date;
}