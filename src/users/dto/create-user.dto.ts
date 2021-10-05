import {
  IsNumber,
  IsDate,
  IsOptional,
  IsBoolean,
  IsString,
} from 'class-validator';
export class CreateUserDto {
  @IsNumber()
  readonly id: number;

  @IsNumber()
  readonly intra: number;

  @IsString()
  readonly slack: string;

  @IsDate()
  readonly penaltiyAt: Date;

  @IsNumber()
  readonly reservationCnt: number;

  @IsOptional()
  @IsBoolean({ each: false })
  readonly librarian: boolean;

  @IsDate()
  readonly createAt: Date;

  @IsDate()
  readonly updateAt: Date;
}
