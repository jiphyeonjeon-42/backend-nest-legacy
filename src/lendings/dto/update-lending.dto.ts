import { PartialType } from '@nestjs/mapped-types';
import { CreateLendingDto } from './create-lending.dto';

export class UpdateLendingDto extends PartialType(CreateLendingDto) {}
