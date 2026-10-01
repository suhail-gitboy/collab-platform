import {
    Table,
    Column,
    Model,
    DataType,
    Default,
    AllowNull,
    Unique,
    ForeignKey,
    BelongsTo,
    BelongsToMany,
} from 'sequelize-typescript';



import BusinessProfile from 'src/modules/business-side/model/busines.modelmain';
import { Category } from 'src/modules/categories/model/category-model';
import { CreatorCategory } from 'src/modules/creator_profile/model/creatorcategory';
import { CampaignStatus, CollaborationType } from 'src/types/types.common';

@Table({
    tableName: 'campaigns',
    timestamps: false,
})
export class Campaign extends Model {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    })
    declare id: string;

    @ForeignKey(() => BusinessProfile)
    @AllowNull(false)
    @Column({
        type: DataType.UUID,
    })
    declare businessId: string;

    @BelongsTo(() => BusinessProfile)
    business: BusinessProfile;

    @AllowNull(false)
    @Column({
        type: DataType.STRING(200),
    })
    declare title: string;

    @Column({
        type: DataType.TEXT,
    })
    declare description: string;

    @Column({
        type: DataType.TEXT,
    })
    declare coverImageUrl: string;

    @AllowNull(false)
    @Column({
        type: DataType.ENUM(...Object.values(CollaborationType)),
    })
    declare collaborationType: CollaborationType;

    @Column({
        type: DataType.DECIMAL(10, 2),
    })
    declare budgetMin: number;

    @Column({
        type: DataType.DECIMAL(10, 2),
    })
    declare budgetMax: number;

    @AllowNull(false)
    @Default('INR')
    @Column({
        type: DataType.STRING(3),
    })
    declare currency: string;

    @Column({
        type: DataType.TEXT,
    })
    declare requirements: string;

    @Column({
        type: DataType.TEXT,
    })
    declare deliverables: string;

    @Column({
        type: DataType.STRING(100),
    })
    declare targetCity: string;

    @Column({
        type: DataType.STRING(100),
    })
    declare targetState: string;

    @Column({
        type: DataType.STRING(100),
    })
    declare targetCountry: string;

    @Column({
        type: DataType.DATEONLY,
    })
    declare applicationDeadline: string;

    @AllowNull(false)
    @Default(CampaignStatus.DRAFT)
    @Column({
        type: DataType.ENUM(...Object.values(CampaignStatus)),
    })
    declare status: CampaignStatus;

    @BelongsToMany(() => Category, () => Category)
    categories: Category[];

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