import { Table, Column, Model, DataType, BelongsTo, HasMany } from "@biorate/sequelize";
import { User } from "./user.model";
import { UserGame } from "./userGame.model";

@Table({
  schema: "user_games",
  timestamps: false,
  freezeTableName: true,
  tableName: "games",
})
export class Game extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrementIdentity: true, autoIncrement: true })
  id: number;

  @Column({ type: DataType.CHAR, allowNull: false })
  name: string;

  @Column({ type: DataType.CHAR, allowNull: false })
  icon: string;

  @Column({ type: DataType.TIME, allowNull: true })
  createdat: Date;

  @Column({ type: DataType.TIME, allowNull: true })
  updatedat: Date;

  @HasMany(() => UserGame, { foreignKey: "userid", sourceKey: "id" })
  users: UserGame[];
}
