// languages.model.ts
import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    AutoIncrement,
    AllowNull,
    Unique,
} from 'sequelize-typescript';

@Table({
    tableName: 'languages',
    timestamps: false,
})
export class Language extends Model {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    })
    declare id: string;

    @AllowNull(false)
    @Unique

    @Column(DataType.STRING(100))
    name: string;

    @Unique
    @Column(DataType.STRING(10))
    code: string; // ISO 639-1, e.g. 'en', 'hi', 'ml'
}