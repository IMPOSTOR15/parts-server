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
    sell_quantity: string;
    supplier_id: number;
    supplier_code: string;
    seller_code: string;
    part_price: number;
    status: string;
    lenght: string;
    height: string;
    width: string;
}

interface PartsInStockCreationAttributes extends Optional<PartsInStockAttributes, 'id'> {}

class PartsInStock extends Model<PartsInStockAttributes, PartsInStockCreationAttributes> implements PartsInStockAttributes {
    public id!: number;
    public title!: string;
    public part_number!: string;
    public brand!: string;
    public quantity!: number;
    public sell_quantity!: string;
    public supplier_id!: number;
    public supplier_code!: string;
    public seller_code!: string;
    public part_price!: number;
    public status!: string
    public lenght!: string;
    public height!: string;
    public width!: string;
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
        sell_quantity: {
            type: DataTypes.TEXT,
        },
        supplier_id: {
            type: DataTypes.BIGINT,
        },
        supplier_code: {
            type: DataTypes.TEXT,
        },
        seller_code: {
            type: DataTypes.TEXT,
        },
        part_price: {
            type: DataTypes.TEXT,
        },
        status: {
            type: DataTypes.TEXT,
        },
        lenght: {
            type: DataTypes.TEXT,
        },
        height: {
            type: DataTypes.TEXT,
        },
        width: {
            type: DataTypes.TEXT,
        }
    },
    {
        sequelize,
        tableName: 'parts_in_stock',
        timestamps: false,
    }
);


interface CurrentSaleTasksAttributes {
    id: number;
}

interface CurrentSaleTasksCreationAttributes extends Optional<CurrentSaleTasksAttributes, 'id'> {}

class CurrentSaleTasks extends Model<CurrentSaleTasksAttributes, CurrentSaleTasksCreationAttributes> implements CurrentSaleTasksAttributes {
    public id!: number;

}

CurrentSaleTasks.init(
    {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
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
