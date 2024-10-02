import { Response, Request, NextFunction } from "express";
import { TokenExpiredError } from "jsonwebtoken";
import {
  ForeignKeyViolationError,
  ValidationError,
} from "objection";

export class SendError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err) {
    if (err instanceof ValidationError) {
      let msg = err.message.split(",")[0];
      return res.status(err.statusCode).json({
        success: false,
        statusCode: err.statusCode,
        message: msg,
      });
    }

    if (err instanceof ForeignKeyViolationError) {
      let msg = err.constraint.split("_");
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: `${msg[1]} not available`,
      });
    }

    if (err instanceof TokenExpiredError) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: err.message,
      });
    }

    if (err instanceof SendError) {
      return res.status(err.statusCode).json({
        success: false,
        statusCode: err.statusCode,
        message: err.message,
      });
    }

    (() => {
      console.log(err);
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: err,
      });
    })();
  }
}