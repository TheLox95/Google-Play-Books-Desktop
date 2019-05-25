import { ErrorCode } from "./ErrorCodes";

interface IErrorMeta {
  code: ErrorCode;
  message: string;
}

export class AppError extends Error {
  constructor(public m: IErrorMeta) {
      super(m.message);

      Object.setPrototypeOf(this, AppError.prototype);
  }
}
