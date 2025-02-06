import { Table, Column, Model, DataType, BelongsTo, HasMany } from '@biorate/sequelize';

@Table({
  schema: 'users',
  timestamps: false,
  freezeTableName: true,
  tableName: 'users',
})
export class User extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrementIdentity: true, autoIncrement: true })
  id: number;

  @Column({ type: DataType.TIME, allowNull: true })
  createdat: Date;

  @Column({ type: DataType.TIME, allowNull: true })
  updatedat: Date;

  @Column({ type: DataType.CHAR, allowNull: false })
  email: string;

  @Column({ type: DataType.CHAR, allowNull: false,  })
  hash: string;

  @Column({ type: DataType.CHAR, allowNull: true })
  firstname: string;

  @Column({ type: DataType.CHAR, allowNull: true })
  lastname: string;
}
