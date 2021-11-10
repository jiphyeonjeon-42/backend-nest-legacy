import { ValidationPipe, ValidationPipeOptions } from '@nestjs/common';

class CustomValidationPipe extends ValidationPipe {
  constructor(options?: ValidationPipeOptions) {
    super(options);
  }
}
