import { PartialType } from '@nestjs/mapped-types';
import { CreateReturnDto } from './create-return.dto';

export class UpdateReturnDto extends PartialType(CreateReturnDto) {}
