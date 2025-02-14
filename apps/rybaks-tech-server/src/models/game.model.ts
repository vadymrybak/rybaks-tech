import { Table, Column, Model, DataType, BelongsTo, HasMany } from "@biorate/sequelize";

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

  @Column({ type: DataType.TIME, allowNull: true })
  createdat: Date;

  @Column({ type: DataType.TIME, allowNull: true })
  updatedat: Date;
}
