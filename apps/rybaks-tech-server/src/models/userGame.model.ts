import { Table, Column, Model, DataType, BelongsTo, HasMany } from "@biorate/sequelize";
import { User } from "./user.model";
import { Game } from "./game.model";

@Table({
  schema: "user_games",
  timestamps: false,
  freezeTableName: true,
  tableName: "user_games",
})
export class UserGame extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrementIdentity: true, autoIncrement: true })
  id: number;

  @Column({ type: DataType.INTEGER })
  userid: number;

  @Column({ type: DataType.INTEGER })
  gameid: number;

  @BelongsTo(() => User, { foreignKey: "userid", targetKey: "id" })
  user: User;

  @BelongsTo(() => Game, { foreignKey: "gameid", targetKey: "id" })
  game: Game;
}
