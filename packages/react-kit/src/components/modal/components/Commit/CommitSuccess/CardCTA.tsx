import React, { ReactElement } from "react";
import styled from "styled-components";
import { Grid } from "../../../../ui/Grid";
import { colors } from "../../../../../theme";
import { Typography } from "../../../../ui/Typography";

type CardCTAProps = {
  title: string;
  text: string;
  icon: ReactElement;
  cta: ReactElement;
  theme?: "light" | "dark";
};

const StyledGrid = styled(Grid)`
  background: ${colors.greyLight};
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

export const CardCTA: React.FC<CardCTAProps> = ({ title, text, icon, cta }) => {
  return (
    <StyledGrid flexDirection="column" alignItems="flex-start" padding="1.5rem">
      <IconContainer>{icon}</IconContainer>
      <Typography fontWeight="600" fontSize="1.25rem">
        {title}
      </Typography>
      <Typography tag="p">{text}</Typography>
      {cta}
    </StyledGrid>
  );
};
