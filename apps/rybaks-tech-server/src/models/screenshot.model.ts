import { BelongsTo, Column, DataType, Model, Table } from "@biorate/sequelize";
import { User } from "./user.model";
import { ScreenshotGameUser } from "./screenshotGameUser.model";

@Table({
  schema: "screenshots",
  timestamps: false,
  freezeTableName: true,
  tableName: "screenshots",
})
export class Screenshot extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrementIdentity: true, autoIncrement: true })
  id: number;

  @Column({ type: DataType.CHAR, allowNull: false })
  base64: string;

  @Column({ type: DataType.CHAR, allowNull: true })
  name: string;

  @Column({ type: DataType.CHAR, allowNull: true })
  description: string;

  @Column({ type: DataType.TIME, allowNull: true })
  updatedat: Date;

  @Column({ type: DataType.TIME, allowNull: true })
  createdat: Date;

  @BelongsTo(() => ScreenshotGameUser, { foreignKey: "id", targetKey: "screenshotid" })
  screenshotGameUser: ScreenshotGameUser;
}
