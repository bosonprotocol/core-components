import { Warning } from "phosphor-react";
import React, { ReactNode } from "react";
import styled, { CSSProperties } from "styled-components";

import { theme } from "../../theme";
import { Grid, GridProps } from "../ui/Grid";
import { Typography } from "../ui/Typography";
const colors = theme.colors.light;

const StyledGrid = styled(Grid)<{
  $background: CSSProperties["backgroundColor"];
}>`
  background-color: ${({ $background }) => $background};
`;

export type SimpleErrorProps = GridProps & {
  errorMessage?: string;
  children?: ReactNode;
  backgroundColor?: CSSProperties["backgroundColor"];
  warningColor?: CSSProperties["backgroundColor"];
};

export function SimpleError({
  errorMessage,
  children,
  backgroundColor = colors.lightGrey,
  warningColor = colors.darkOrange,
  ...rest
}: SimpleErrorProps) {
  return (
    <StyledGrid
      justifyContent="flex-start"
      gap="0.5rem"
      margin="1.5rem 0 0 0"
      padding="1.5rem"
      $background={backgroundColor}
      {...rest}
    >
      <Warning color={warningColor} size={16} />
      {children ? (
        children
      ) : (
        <Typography fontWeight="600" fontSize="1rem" lineHeight="1.5rem">
          {errorMessage || "There has been an error, please try again"}
        </Typography>
      )}
    </StyledGrid>
  );
}
