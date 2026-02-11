import type { NextFunction, Request, Response } from "express";
import { Prisma } from "../generated/prisma/client";

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Error =>", { err });

  let statusCode = 500;
  let errorMessage = "Internal sarver error";

  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    errorMessage = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message: errorMessage,
  });
};

export default globalErrorHandler;
