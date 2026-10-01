import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
    CreatedAt,
    UpdatedAt,
} from "sequelize-typescript";
import { User } from "src/modules/auth/models/user-models";

@Table({
    tableName: "business_profiles",
    timestamps: false,
})
export class BusinessProfile extends Model {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    })
    declare id: string;

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        allowNull: false,
        unique: true,
    })
    declare user_id: string;

    @BelongsTo(() => User)
    declare user?: User;

    @Column({ type: DataType.STRING(200), allowNull: false })
    declare business_name: string;

    @Column({ type: DataType.TEXT, allowNull: true })
    declare description: string | null;

    @Column({ type: DataType.TEXT, allowNull: true })
    declare logo_url: string | null;

    @Column({ type: DataType.TEXT, allowNull: true })
    declare cover_photo_url: string | null;

    @Column({ type: DataType.TEXT, allowNull: true })
    declare website_url: string | null;

    @Column({ type: DataType.STRING(100), allowNull: true })
    declare city: string | null;

    @Column({ type: DataType.STRING(100), allowNull: true })
    declare state: string | null;

    @Column({ type: DataType.STRING(100), allowNull: true })
    declare country: string | null;

    @Column({ type: DataType.DECIMAL(9, 6), allowNull: true })
    declare latitude: number | null;

    @Column({ type: DataType.DECIMAL(9, 6), allowNull: true })
    declare longitude: number | null;

    @Column({ type: DataType.GEOGRAPHY("POINT", 4326), allowNull: true })
    declare location: any;

    @Column({ type: DataType.DECIMAL(10, 2), allowNull: true })
    declare typical_budget_min: string | null;

    @Column({ type: DataType.DECIMAL(10, 2), allowNull: true })
    declare typical_budget_max: string | null;

    @Column({ type: DataType.STRING(3), allowNull: false, defaultValue: "INR" })
    declare currency: string;

    @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
    declare is_verified: boolean;

    @Column({ type: DataType.DECIMAL(3, 2), allowNull: false, defaultValue: 0 })
    declare average_rating: string;

    @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
    declare total_reviews: number;

    @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
    declare total_collaborations: number;

    @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
    declare created_at: Date;

    @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
    declare updated_at: Date;
}

export default BusinessProfile;