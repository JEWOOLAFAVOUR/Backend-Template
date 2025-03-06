import { Response } from "express";
import { ErrorResponse } from "./types";

export const sendError = (
  res: Response,
  status: number = 404,
  message: string = "Not found",
  error: any = null
): void => {
  const response: ErrorResponse = {
    success: false,
    message,
    error,
  };
  if (error) {
    response.error = error;
  }
  res.status(status).json(response);
};
