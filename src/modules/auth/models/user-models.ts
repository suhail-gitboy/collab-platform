import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    Default,

} from 'sequelize-typescript';
import { userRole } from 'src/types/types.common';

@Table({
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
})
export class User extends Model {

    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    declare id: string;
    @Column({
        type: DataType.STRING(100),
        allowNull: false,
    })
    declare name: string;

    @Column({
        type: DataType.STRING(15),
        allowNull: true,
        unique: true,
    })
    declare phone: string | null;

    @Column({
        type: DataType.STRING(150),
        allowNull: true,
        unique: true,
    })
    declare email: string | null;
    @Column({
        type: DataType.ENUM(
            'admin',
            'creator',
            'business',
        ),
        allowNull: true,
        unique: true,
    })
    declare user_type: 'admin' | 'creator' | 'business';

    @Column({
        type: DataType.ENUM(
            'GOOGLE',
            'OTP',
            'APPLE',
        ),
        allowNull: false,
        field: 'auth_provider',
    })
    declare auth_provider: 'GOOGLE' | 'OTP' | 'APPLE';

    @Column({
        type: DataType.STRING(20),
        allowNull: false,
        defaultValue: 'ACTIVE',
    })
    declare status: 'ACTIVE' | 'BLOCKED' | 'DELETED';
}