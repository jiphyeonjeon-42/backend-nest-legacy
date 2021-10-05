import { IsNumber, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateReturnDto {
  @IsNotEmpty()
  condition: string;

  @IsNumber()
  lendingId: number;

  @IsNumber()
  userId: number;

  @IsNumber()
  @IsOptional()
  librarianId: number;
}
