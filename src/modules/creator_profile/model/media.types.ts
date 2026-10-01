import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
} from "sequelize-typescript";

import { SocialPlatform } from "src/types/types.common";
import CreatorProfile from "./model";

@Table({
    tableName: "creator_social_accounts",
    timestamps: false,
})
export class CreatorSocialAccount extends Model {

    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    })
    declare id: string;

    @ForeignKey(() => CreatorProfile)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    declare creator_id: string;

    @BelongsTo(() => CreatorProfile)
    declare creator?: CreatorProfile;

    @Column({
        type: DataType.ENUM(...Object.values(SocialPlatform)),
        allowNull: false,
    })
    declare platform: SocialPlatform;

    @Column({
        type: DataType.STRING(100),
        allowNull: false,
    })
    declare handle: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    declare profile_url: string | null;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0,
    })
    declare followers_count: number;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    })
    declare is_verified: boolean;

    @Column({
        type: DataType.DATE,
        allowNull: true,
    })
    declare last_synced_at: Date | null;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        defaultValue: DataType.NOW,
    })
    declare created_at: Date;
}