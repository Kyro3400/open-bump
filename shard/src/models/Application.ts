import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table
} from "sequelize-typescript";
import ApplicationFeature from "./ApplicationFeature";
import User from "./User";

@Table({
  tableName: "Application",
  defaultScope: {
    include: [{ model: ApplicationFeature, as: "features" }]
  }
})
export default class Application extends Model<Application> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @AllowNull(false)
  @Column(DataType.UUID)
  id!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  name!: string;

  @ForeignKey(() => User)
  @Column
  userId!: string;

  @Default(DataType.UUIDV4)
  @AllowNull(false)
  @Column(DataType.UUID)
  token!: string;

  @BelongsTo(() => User)
  user!: User;

  @HasMany(() => ApplicationFeature)
  features!: Array<ApplicationFeature>;
}