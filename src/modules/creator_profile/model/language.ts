import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
} from "sequelize-typescript";

import { Language } from "src/modules/language/model";
import CreatorProfile from "./model";


@Table({
    tableName: "creator_languages",
    timestamps: false,
})
export class CreatorLanguage extends Model {

    @ForeignKey(() => CreatorProfile)
    @Column({
        type: DataType.UUID,
        allowNull: false,
        primaryKey: true,
    })
    declare creator_id: string;

    @BelongsTo(() => CreatorProfile)
    declare creator?: CreatorProfile;

    @ForeignKey(() => Language)
    @Column({
        type: DataType.UUID,
        allowNull: false,
        primaryKey: true,
    })
    declare language_id: string;

    @BelongsTo(() => Language)
    declare language?: Language;
}