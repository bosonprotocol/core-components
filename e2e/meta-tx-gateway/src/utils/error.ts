import { ValidationError } from "express-validator";

export function validationErrorFormatter({
  location,
  msg,
  param
}: ValidationError) {
  return ` ${location}[${param}]: ${msg}`;
}
