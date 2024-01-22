import React from "react";
import { theme } from "../../theme";

import Typography from "../ui/Typography";
import type { ErrorProps } from "./types";
const colors = theme.colors.light;

export default function Error({ display = false, message = "" }: ErrorProps) {
  if (!display) {
    return null;
  }
  return (
    <Typography
      tag="p"
      color={colors.orange}
      margin="0.25rem"
      fontWeight="600"
      fontSize="0.75rem"
      style={{ whiteSpace: "pre-wrap" }}
    >
      {message}
    </Typography>
  );
}
