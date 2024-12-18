import React from "react";
import { Toast } from "react-hot-toast";
import { theme } from "../../theme";

import { Grid } from "../ui/Grid";
import { Typography } from "../ui/Typography";
import SuccessToast from "./common/SuccessToast";
const colors = theme.colors.light;

interface Props {
  t: Toast;
  action: string;
  onViewDetails?: () => void;
  url?: string;
}

export default function SuccessTransactionToast({
  t,
  action,
  onViewDetails,
  url
}: Props) {
  return (
    <SuccessToast t={t}>
      <Grid flexDirection="column" alignItems="flex-start">
        <Typography>{action}</Typography>
        {onViewDetails ? (
          <Typography
            color={colors.violet}
            style={{
              cursor: "pointer"
            }}
            onClick={() => onViewDetails()}
          >
            View details
          </Typography>
        ) : url ? (
          <a href={url} target="_blank" rel="noreferrer">
            <Typography color={colors.violet}>View details</Typography>
          </a>
        ) : null}
      </Grid>
    </SuccessToast>
  );
}
