import {
    Table,
    Column,
    Model,
    DataType,
    Default,
    AllowNull,
    Unique,
} from 'sequelize-typescript';

@Table({
    tableName: 'categories',
    timestamps: false,
})
export class Category extends Model {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    })
    declare id: string;

    @AllowNull(false)
    @Unique
    @Column({
        type: DataType.STRING(50),
    })
    declare name: string;

    @AllowNull(false)
    @Column({
        type: DataType.STRING(500),
    })
    declare icon: string;

    @AllowNull(false)
    @Default(0)
    @Column({
        type: DataType.INTEGER,
    })
    declare sortOrder: number;

    @AllowNull(false)
    @Default(true)
    @Column({
        type: DataType.BOOLEAN,
    })
    declare isActive: boolean;

    @AllowNull(false)
    @Column({
        type: DataType.DATE,
        defaultValue: DataType.NOW,
    })
    declare createdAt: Date;
}