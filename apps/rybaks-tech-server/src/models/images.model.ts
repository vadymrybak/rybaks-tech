import { Table, Column, Model, DataType, BelongsTo, HasMany } from "@biorate/sequelize";

@Table({
  schema: "images",
  timestamps: false,
  freezeTableName: true,
  tableName: "images",
})
export class Images extends Model {
  @Column({ type: DataType.CHAR, primaryKey: false, allowNull: false })
  filename: number;
}
