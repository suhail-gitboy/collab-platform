import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
} from "sequelize-typescript";
import CreatorProfile from "src/modules/creator_profile/model/model";


@Table({
    tableName: "portfolio_content",
    timestamps: false,
})
export class PortfolioContent extends Model {
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
        type: DataType.STRING(20),
        allowNull: false,
        validate: {
            isIn: [["youtube", "instagram", "tiktok", "twitter", "other"]],
        },
    })
    declare platform: string;

    @Column({ type: DataType.TEXT, allowNull: false, unique: true })
    declare url: string;

    @Column({ type: DataType.TEXT, allowNull: true })
    declare post_title: string | null;
    @Column({ type: DataType.TEXT, allowNull: true })
    declare thumbnail: string | null;

    @Column({ type: DataType.STRING(255), allowNull: true })
    declare channel_name: string | null;

    @Column({ type: DataType.DATE, allowNull: true })
    declare posted_at: Date | null;

    // Core metrics
    @Column({ type: DataType.BIGINT, allowNull: false, defaultValue: 0 })
    declare views: number;

    @Column({ type: DataType.BIGINT, allowNull: false, defaultValue: 0 })
    declare likes: number;

    @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
    declare comments_count: number;

    @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
    declare shares: number;

    @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
    declare saves: number;

    // Generated columns — DB-computed, read-only from the app side
    @Column({ type: DataType.DECIMAL(6, 4), allowNull: true })
    declare like_rate: string | null;

    @Column({ type: DataType.DECIMAL(6, 4), allowNull: true })
    declare comment_rate: string | null;

    // Metadata
    @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
    declare fetched_at: Date;

    @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
    declare created_at: Date;

    @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
    declare updated_at: Date;
}

export default PortfolioContent;