import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
    Default,
    PrimaryKey,
    CreatedAt,
} from "sequelize-typescript";
import { User } from "src/modules/auth/models/user-models";

@Table({
    tableName: "coin_transactions",
    timestamps: true,
    updatedAt: false, // insert-only history log — never updated
    underscored: true,
})
export class CoinTransaction extends Model {
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
        type: DataType.ENUM("credit", "debit"),
        allowNull: false,
    })
    declare type: "credit" | "debit";

    @Column({
        type: DataType.ENUM(
            "signup_bonus",
            "monthly_trickle",
            "purchase",
            "contact_unlock",
            "rfp_apply",
            "proposal_boost",
            "expiry_writeoff"
        ),
        allowNull: false,
    })
    declare action:
        | "signup_bonus"
        | "monthly_trickle"
        | "purchase"
        | "contact_unlock"
        | "rfp_apply"
        | "proposal_boost"
        | "expiry_writeoff";

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare coins: number; // positive for credit, negative for debit

    @Column({
        type: DataType.UUID,
        allowNull: true,
    })
    declare reference_id?: string; // e.g. rfp_id, payment_id, proposal_id

    @Column({
        type: DataType.ARRAY(DataType.UUID),
        allowNull: true,
    })
    declare batch_ids?: string[];

    @CreatedAt
    declare created_at: Date;
}

export default CoinTransaction;