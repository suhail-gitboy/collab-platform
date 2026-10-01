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
    tableName: "reviews",
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ["collaboration_request_id", "reviewer_id"],
            name: "reviews_collab_reviewer_unique",
        },
        {
            fields: ["reviewer_id"],
            name: "idx_reviews_reviewer",
        },
        {
            fields: ["reviewee_id"],
            name: "idx_reviews_reviewee",
        },
        {
            fields: ["reviewee_id", "created_at"],
            name: "idx_reviews_reviewee_created",
        },
    ],
})
export class Review extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column({
        type: DataType.UUID,
    })
    declare id: string;

    // plain UUID for now — no FK/association until CollaborationRequest model exists
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    declare collaboration_request_id: string;

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    declare reviewer_id: string;

    @BelongsTo(() => User, { foreignKey: "reviewer_id", onDelete: "CASCADE" })
    declare reviewer?: User;

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    declare reviewee_id: string;

    @BelongsTo(() => User, { foreignKey: "reviewee_id", onDelete: "CASCADE" })
    declare reviewee?: User;

    @Column({
        type: DataType.SMALLINT,
        allowNull: false,
        validate: {
            min: 1,
            max: 5,
        },
    })
    declare rating: number;

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    declare comment?: string;

    @CreatedAt
    @Column({
        type: DataType.DATE,
        allowNull: false,
        defaultValue: DataType.NOW,
    })
    declare created_at: Date;
}

export default Review;