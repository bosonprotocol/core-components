import { Info } from "phosphor-react";
import { CSSProperties, styled } from "styled-components";
import { Grid } from "../../../../ui/Grid";
import React from "react";
import { Typography } from "../../../../ui/Typography";
import { theme } from "../../../../../theme";

const colors = theme.colors.light;

const Wrapper = styled(Grid)`
  border: 1px solid ${colors.border};
`;

type InfoBoxTheme = {
  iconProps: Parameters<typeof Info>[0];
  messageProps: Parameters<typeof Typography>[0];
  wrapperStyle: CSSProperties;
};

export type InfoBoxProps = {
  message: string;
  customTheme?: Partial<InfoBoxTheme>;
  className?: string;
};

export const InfoBox = ({
  message,
  customTheme: { iconProps, wrapperStyle, messageProps } = {},
  className
}: InfoBoxProps) => {
  return (
    <Wrapper
      gap="0.5rem"
      padding="1rem"
      justifyContent="flex-start"
      style={wrapperStyle}
      className={className}
    >
      <Info color={colors.violet} weight="bold" {...iconProps} />
      <Typography fontSize="0.875rem" {...messageProps}>
        {message}
      </Typography>
    </Wrapper>
  );
};
