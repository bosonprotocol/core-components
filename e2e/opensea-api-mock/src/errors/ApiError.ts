import { API_ERROR } from "./types";

export class ApiError extends Error {
  statusCode: number;

  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = API_ERROR;
  }
}
