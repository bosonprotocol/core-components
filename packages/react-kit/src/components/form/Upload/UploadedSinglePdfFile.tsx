import { Grid } from "../../ui/Grid";
import { FilePdf, X } from "phosphor-react";
import { Typography } from "../../ui/Typography";
import React from "react";
import { colors } from "../../../colors";

export type UploadedSinglePdfFileProps = {
  fileName: string;
  onXClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
};
export const UploadedSinglePdfFile = ({
  fileName,
  onXClick
}: UploadedSinglePdfFileProps) => {
  return (
    <Grid flexDirection="row" alignItems="center" gap="0.25rem">
      <div>
        <FilePdf size={24} />
      </div>
      <Typography
        width={"100%"}
        color={colors.deepPurple}
        fontSize={"0.875rem"}
      >
        {fileName}
      </Typography>
      {onXClick && (
        <button
          type="button"
          style={{
            display: "flex",
            justifyContent: "center"
          }}
          onClick={onXClick}
        >
          <X size={12.5} />
        </button>
      )}
    </Grid>
  );
};
