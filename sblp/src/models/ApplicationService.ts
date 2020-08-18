import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table
} from "sequelize-typescript";
import Application from "./Application";

@Table({
  tableName: "ApplicationService"
})
export default class ApplicationService extends Model<ApplicationService> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @AllowNull(false)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => Application)
  @AllowNull(false)
  @Column
  applicationId!: string;

  @BelongsTo(() => Application, "applicationId")
  application!: Application;

  @ForeignKey(() => Application)
  @AllowNull(false)
  @Column
  targetId!: string;

  @BelongsTo(() => Application, "targetId")
  target!: Application;

  @Column(DataType.STRING)
  token!: string;
}
