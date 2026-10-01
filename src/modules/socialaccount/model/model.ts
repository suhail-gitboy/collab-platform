import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
    CreatedAt,
    UpdatedAt,
} from 'sequelize-typescript';

import CreatorProfile from 'src/modules/creator_profile/model/model';

export enum SocialPlatform {
    INSTAGRAM = 'instagram',
    FACEBOOK = 'facebook',
    YOUTUBE = 'youtube',
    TIKTOK = 'tiktok',
}

@Table({
    tableName: 'creator_social_accounts',
    timestamps: true,
    underscored: true,
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
    declare creator: CreatorProfile;

    @Column({
        type: DataType.ENUM(...Object.values(SocialPlatform)),
        allowNull: false,
    })
    declare platform: SocialPlatform;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare handle: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    declare profile_url: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
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
        type: DataType.TEXT,
        allowNull: false,
    })
    declare access_token: string;

    @Column({
        type: DataType.DATE,
        allowNull: true,
    })
    declare token_expires_at: Date;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    declare account_type: string;

    @CreatedAt
    declare created_at: Date;

    @UpdatedAt
    declare updated_at: Date;
}