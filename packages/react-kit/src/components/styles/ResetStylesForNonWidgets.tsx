import styled from "styled-components";
import { theme } from "../../theme";
const colors = theme.colors.light;

export const ResetStylesForNonWidgets = styled.div`
  // TODO: check if we can avoid this by using shadow dom (react-shadow for example)
  color: ${colors.black};
`;
