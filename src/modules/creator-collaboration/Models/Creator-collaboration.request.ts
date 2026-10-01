
// import { Category } from "src/modules/category/model";
// import { CollaborationResponse } from "./collaboration-response.model";
import { User } from "src/modules/auth/models/user-models";
import { Category } from "src/modules/categories/model/category-model";
import CollaborationResponse from "./Creator-collaboration";

import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
    HasMany,
    PrimaryKey,
    Default,
    CreatedAt,
    UpdatedAt,
} from "sequelize-typescript";
import CreatorProfile from "src/modules/creator_profile/model/model";


export enum CollaborationType {
    BARTER = "barter",
    PAID = "paid",
    GIFTED = "gifted",
    AFFILIATE = "affiliate",
}

export enum CollabAudience {
    CREATOR = "creator",
    BUSINESS = "business",
    BOTH = "both",
}
export enum CampaignStatus {
    DRAFT = "draft",
    ACTIVE = "active",
    CLOSED = "closed",
    EXPIRED = "expired",
}

export enum CollaborationMode {
    ONLINE = "online",
    DIRECT = "direct",
}

@Table({
    tableName: "creator_collaboration_posts",
    timestamps: true,
})
export class CollaborationPost extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column({ type: DataType.UUID })
    declare id: string;

    @ForeignKey(() => CreatorProfile)
    @Column({ type: DataType.UUID, allowNull: false })
    declare user_id: string;

    @BelongsTo(() => CreatorProfile)
    declare user?: CreatorProfile;

    @Column({ type: DataType.STRING(200), allowNull: false })
    declare title: string;

    @Column({ type: DataType.TEXT, allowNull: true })
    declare description?: string;

    @ForeignKey(() => Category)
    @Column({ type: DataType.UUID, allowNull: true })
    declare category_id?: string;

    @BelongsTo(() => Category)
    declare category?: Category;

    @Column({
        type: DataType.ENUM(...Object.values(CollaborationType)),
        allowNull: false,
    })
    declare collaboration_type: CollaborationType;

    @Column({
        type: DataType.ENUM(...Object.values(CollabAudience)),
        allowNull: false,
        defaultValue: CollabAudience.BOTH,
    })
    declare looking_for: CollabAudience;

    @Column({
        type: DataType.ENUM(...Object.values(CollaborationMode)),
        allowNull: false,
    })
    declare collaboration_mode: CollaborationMode;



    @Column({ type: DataType.DECIMAL(10, 2), allowNull: true })
    declare budget?: number;

    @Column({ type: DataType.TEXT, allowNull: true })
    declare requirements?: string;

    @Column({ type: DataType.TEXT, allowNull: true })
    declare deliverables?: string;

    @Column({ type: DataType.STRING(100), allowNull: true })
    declare target_city?: string;

    @Column({ type: DataType.STRING(100), allowNull: true })
    declare target_state?: string;

    @Column({ type: DataType.STRING(100), allowNull: true })
    declare target_country?: string;

    @Column({
        type: DataType.ENUM(...Object.values(CampaignStatus)),
        allowNull: false,
        defaultValue: CampaignStatus.DRAFT,
    })
    declare status: CampaignStatus;

    @HasMany(() => CollaborationResponse)
    declare responses?: CollaborationResponse[];

    @CreatedAt
    @Column({ field: "created_at" })
    declare created_at: Date;

    @UpdatedAt
    @Column({ field: "updated_at" })
    declare updated_at: Date;
}

export default CollaborationPost;