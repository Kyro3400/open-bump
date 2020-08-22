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
  Table,
  Unique
} from "sequelize-typescript";
import ApplicationService from "./ApplicationService";
import User from "./User";

@Table({
  tableName: "Application",
  scopes: {
    full: {
      include: [
        {
          model: ApplicationService,
          as: "applicationServices",
          include: [
            {
              model: Application,
              as: "target"
            }
          ]
        }
      ]
    }
  }
})
export default class Application extends Model<Application> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @AllowNull(false)
  @Column(DataType.UUID)
  id!: string;

  @Column(DataType.STRING)
  name!: string;

  @Unique
  @Column(DataType.STRING(64))
  host!: string;

  @ForeignKey(() => User)
  @Column
  userId!: string;

  @BelongsTo(() => User)
  user!: User;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING(20))
  bot!: string;

  @Column(DataType.STRING)
  base?: string | null;

  @HasMany(() => ApplicationService, "applicationId")
  applicationServices!: Array<ApplicationService>;

  @HasMany(() => ApplicationService, "targetId")
  targetServices!: Array<ApplicationService>;

  /* The token this application uses to create bump tasks */
  @Column(DataType.STRING)
  token!: string;

  /* The token SBLP Centralized uses to forward requests to this application */
  @Column(DataType.STRING)
  authorization!: string;

  public getBase() {
    let url = this.base;
    if (url && !url.endsWith("/")) url += "/";
    return url;
  }
}
