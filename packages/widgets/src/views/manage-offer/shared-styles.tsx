import styled from "styled-components";
import { colors } from "../../lib/colors";
import { Button, buttonWidth } from "../../lib/components/Button";

export const columnGap = 24;

export const SecondaryButton = styled(Button)`
  background-color: ${colors.cyberSpaceGray};
  color: ${colors.neonGreen};
  border-color: ${colors.neonGreen};
`;

export const PrimaryButton = styled(Button)`
  background-color: ${colors.neonGreen};
  opacity: 0.9;
`;

export const Actions = styled.div`
  display: flex;
  justify-content: center;
  gap: ${columnGap}px;

  > button {
    max-width: ${buttonWidth * 2 + columnGap}px;
  }
`;
