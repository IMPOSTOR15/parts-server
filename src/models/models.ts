import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db';

// User Model
interface UserAttributes {
    id: number;
    login: string;
    password: string;
    role: string;
    name?: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: number;
    public login!: string;
    public password!: string;
    public role!: string;
    public name?: string;
}

User.init(
    {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },
        login: {
            type: DataTypes.TEXT,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        role: {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: 'user',
        },
        name: {
            type: DataTypes.TEXT,
            unique: true,
        },
    },
    {
        sequelize,
        tableName: 'user',
        timestamps: false,
    }
);

// PartsInStock Model
interface PartsInStockAttributes {
    id: number;
    title: string;
    part_number: string;
    brand: string;
    quantity: number;
}

interface PartsInStockCreationAttributes extends Optional<PartsInStockAttributes, 'id'> {}

class PartsInStock extends Model<PartsInStockAttributes, PartsInStockCreationAttributes> implements PartsInStockAttributes {
    public id!: number;
    public title!: string;
    public part_number!: string;
    public brand!: string;
    public quantity!: number;
}

PartsInStock.init(
    {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.TEXT,
        },
        part_number: {
            type: DataTypes.TEXT,
        },
        brand: {
            type: DataTypes.TEXT,
        },
        quantity: {
            type: DataTypes.BIGINT,
        },
    },
    {
        sequelize,
        tableName: 'parts_in_stock',
        timestamps: false,
    }
);

// Sync models with the database
sequelize
    .sync()
    .then(() => console.log('Database & tables created!'))
    .catch((error: any) => console.log(error));

export { User, PartsInStock };
