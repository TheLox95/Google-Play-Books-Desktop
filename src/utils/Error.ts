import { ErrorCode } from "./ErrorCodes";

interface ErrorMeta{
  code: ErrorCode,
  message: string,
}

export class AppError extends Error {
  constructor(public m: ErrorMeta) {
      super(m.message);

      Object.setPrototypeOf(this, AppError.prototype);
  }
}