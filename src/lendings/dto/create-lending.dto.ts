import { IsString, IsNumber } from 'class-validator';

export class CreateLendingDto {
  @IsString()
  condition: string;

  @IsNumber()
  userId: number;

  @IsNumber()
  bookId: number;
}
