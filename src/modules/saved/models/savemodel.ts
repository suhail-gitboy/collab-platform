import {
    Table,
    Column,
    Model,
    ForeignKey,
    BelongsTo,
    DataType,
    PrimaryKey,
} from 'sequelize-typescript';
import BusinessProfile from 'src/modules/business-side/model/busines.modelmain';
import CreatorProfile from 'src/modules/creator_profile/model/model';


export enum SavedByType {
    CREATOR = 'creator',
    BUSINESS = 'business',
}

@Table({
    tableName: 'saved_relations',
    timestamps: false,
})
export class SavedRelation extends Model {
    @PrimaryKey
    @ForeignKey(() => BusinessProfile)
    @Column({
        type: DataType.UUID,
        allowNull: false,
        field: 'business_id',
    })
    businessId: string;

    @PrimaryKey
    @ForeignKey(() => CreatorProfile)
    @Column({
        type: DataType.UUID,
        allowNull: false,
        field: 'creator_id',
    })
    creatorId: string;

    @PrimaryKey
    @Column({
        type: DataType.ENUM(...Object.values(SavedByType)),
        allowNull: false,
        field: 'saved_by',
    })
    savedBy: SavedByType;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        defaultValue: DataType.NOW,
        field: 'saved_at',
    })
    savedAt: Date;

    @BelongsTo(() => BusinessProfile, {
        foreignKey: 'businessId',
        onDelete: 'CASCADE',
    })
    business: BusinessProfile;

    @BelongsTo(() => CreatorProfile, {
        foreignKey: 'creatorId',
        onDelete: 'CASCADE',
    })
    creator: CreatorProfile;
}