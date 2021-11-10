import { ValidationPipe } from '@nestjs/common';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';

export class CodeValidationPipe extends ValidationPipe {
  constructor(code = 1, options = {}) {
    super(options);
    this.exceptionFactory = (validationErrors = []) => {
      if (this.isDetailedOutputDisabled) {
        return new HttpErrorByCode[this.errorHttpStatusCode]();
      }
      const errors = this.flattenValidationErrors(validationErrors);
      return new HttpErrorByCode[this.errorHttpStatusCode]({
        errorCode: code,
        messages: errors,
      });
    };
  }
}
