import { IsNumber, IsOptional } from 'class-validator';

export class CreateReservationDto {
  @IsNumber()
  @IsOptional()
  userId: number;

  @IsNumber()
  bookId: number;
}
