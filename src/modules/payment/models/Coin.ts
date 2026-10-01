import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
    Default,
    PrimaryKey,
} from "sequelize-typescript";
import { User } from "src/modules/auth/models/user-models";



@Table({
    tableName: "coin_batches",
    timestamps: true,
    underscored: true,
})
export class CoinBatch extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column({
        type: DataType.UUID,
    })
    declare id: string;

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    declare user_id: string;

    @BelongsTo(() => User)
    declare user?: User;

    @Column({
        type: DataType.ENUM("signup_bonus", "monthly_trickle", "purchase"),
        allowNull: false,
    })
    declare source: "signup_bonus" | "monthly_trickle" | "purchase";

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    declare pack_id?: string; // 'starter' | 'growth' | 'pro'

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare coins_total: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare coins_remaining: number;

    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: true,
    })
    declare price_paid_inr?: number;

    @Default(DataType.NOW)
    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    declare issued_at: Date;

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    declare expires_at: Date;

    @Default("active")
    @Column({
        type: DataType.ENUM("active", "expired", "depleted"),
        allowNull: false,
    })
    declare status: "active" | "expired" | "depleted";
}

export default CoinBatch;