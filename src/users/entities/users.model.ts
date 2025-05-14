import {
  Table,
  Column,
  Model,
  DataType,
  IsEmail,
  Length,
  AllowNull,
  Unique,
  Default,
  BeforeCreate,
  BeforeUpdate,
} from 'sequelize-typescript';
import { InferCreationAttributes, InferAttributes } from 'sequelize';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../enums/user.roles.enums';

@Table({ tableName: 'users', timestamps: true })
export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  @Default(DataType.UUIDV4)
  @Column({ primaryKey: true, type: DataType.UUID })
  declare id?: string;

  @Unique
  @AllowNull(false)
  @IsEmail
  @Length({ max: 150, min: 1 })
  @Column(DataType.STRING(150))
  declare email: string;

  @AllowNull(false)
  @Length({ min: 4, max: 50 })
  @Column(DataType.STRING)
  declare username: string;

  @AllowNull(false)
  @Length({ min: 6, max: 100 })
  @Column(DataType.STRING)
  declare password: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  declare firstName?: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  declare lastName?: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  declare isSuperAdmin?: boolean;

  @AllowNull(true)
  @Column(DataType.ENUM(...Object.values(UserRole))) // Use UserRole enum
  declare role?: UserRole;

  @AllowNull(true)
  @Column(DataType.STRING)
  declare country?: string;

  @Column(DataType.STRING)
  twoFaSecret?: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  isTwoFaEnabled?: boolean;

  @BeforeCreate
  @BeforeUpdate
  static async hashPassword(user: User) {
    if (user.changed('password')) {
      const salt = await bcrypt.genSalt();
      user.password = await bcrypt.hash(user.password, salt);
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
