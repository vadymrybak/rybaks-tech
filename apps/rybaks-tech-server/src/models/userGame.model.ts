import { Table, Column, Model, DataType, BelongsTo, HasMany } from "@biorate/sequelize";

@Table({
  schema: "user_games",
  timestamps: false,
  freezeTableName: true,
  tableName: "user_games",
})
export class Game extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrementIdentity: true, autoIncrement: true })
  id: number;

  @Column({ type: DataType.INTEGER })
  userid: number;

  @Column({ type: DataType.INTEGER })
  gameid: number;
}
