import { BelongsTo, Column, DataType, Model, Table } from "@biorate/sequelize";
import { Game } from "./game.model";
import { User } from "./user.model";

@Table({
  schema: "screenshots",
  timestamps: false,
  freezeTableName: true,
  tableName: "screenshot_user_game",
})
export class ScreenshotGameUser extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrementIdentity: true, autoIncrement: true })
  id: number;

  @Column({ type: DataType.INTEGER })
  screenshotid: number;

  @Column({ type: DataType.INTEGER })
  userid: number;

  @Column({ type: DataType.INTEGER })
  gameid: number;

  @BelongsTo(() => User, { foreignKey: "userid", targetKey: "id" })
  user: User;

  @BelongsTo(() => Game, { foreignKey: "gameid", targetKey: "id" })
  game: Game;
}
