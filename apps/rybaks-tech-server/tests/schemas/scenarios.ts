import { IsNumber } from 'class-validator';

export class ScenariosSchema {
  @IsNumber()
  public a: number;

  @IsNumber()
  public b: number;

  @IsNumber()
  public c: number;

  @IsNumber()
  public d: number;
}
