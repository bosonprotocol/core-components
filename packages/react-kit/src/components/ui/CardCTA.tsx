import React, { ReactElement } from "react";
import styled, { CSSProperties, css } from "styled-components";
import { Grid, GridProps } from "./Grid";
import { Typography, TypographyProps } from "./Typography";

export type CardCTAProps = GridProps & {
  title: string;
  text: string;
  icon: ReactElement;
  cta: ReactElement;
  titleProps?: TypographyProps;
  textProps?: TypographyProps;
  theme: {
    background: CSSProperties["background"];
    color: CSSProperties["color"];
    padding: CSSProperties["padding"];
    border: CSSProperties["border"];
    borderRadius: CSSProperties["borderRadius"];
  };
};

const StyledGrid = styled(Grid)<{ theme: CardCTAProps["theme"] }>`
  ${(props) => {
    return css`
      background: ${props.theme.background};
      color: ${props.theme.color};
      padding: ${props.theme.padding};
      border: ${props.theme.border};
      border-radius: ${props.theme.borderRadius};
    `;
  }}
`;

const IconContainer = styled(Grid)`
  top: 0.5rem;
  right: 0;
  margin-bottom: 1rem;
  svg {
    > * {
      stroke-width: 14px;
    }
  }
`;

export const CardCTA: React.FC<CardCTAProps> = ({
  title,
  text,
  icon,
  cta,
  theme,
  titleProps,
  textProps,
  ...rest
}) => {
  return (
    <StyledGrid
      flexDirection="column"
      alignItems="flex-start"
      padding="1.5rem"
      theme={theme}
      {...rest}
    >
      <>
        <div>
          <IconContainer>{icon}</IconContainer>
          <Typography fontWeight="600" fontSize="1.25rem" {...titleProps}>
            {title}
          </Typography>
        </div>
        <Typography tag="p" {...textProps}>
          {text}
        </Typography>
        {cta}
      </>
    </StyledGrid>
  );
};
