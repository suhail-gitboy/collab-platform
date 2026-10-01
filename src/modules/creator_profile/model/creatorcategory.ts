import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
} from "sequelize-typescript";
import { Category } from "src/modules/categories/model/category-model";
import CreatorProfile from "./model";

@Table({
    tableName: "creator_categories",
    timestamps: false,
})
export class CreatorCategory extends Model {

    @ForeignKey(() => CreatorProfile)
    @Column({
        type: DataType.UUID,
        allowNull: false,
        primaryKey: true,
    })
    declare creator_id: string;

    @BelongsTo(() => CreatorProfile)
    declare creator?: CreatorProfile;

    @ForeignKey(() => Category)
    @ForeignKey(() => Category)
    @Column({
        type: DataType.UUID,
        allowNull: false,
        primaryKey: true,
    })
    declare category_id: string;


    @BelongsTo(() => Category)
    declare category?: Category;
}