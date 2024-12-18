import styled, { css } from "styled-components";
import { theme } from "../../theme";
const colors = theme.colors.light;

export const cssVars = css`
  --l: 50%;
  --headerBgColor: ${colors.white};
  --headerTextColor: ${colors.darkGrey};
  --primary: ${colors.primary};
  --secondary: ${colors.lightGrey};
  --accent: ${colors.accent};
  --accentDark: ${colors.arsenic};
  --textColor: ${colors.black};
  --primaryBgColor: ${colors.primaryBgColor};
  --footerBgColor: ${colors.black};
  --footerTextColor: ${colors.white};
  --buttonBgColor: ${colors.primary};
  --buttonTextColor: ${colors.black};
`;

export const ResetStylesForNonWidgets = styled.div`
  // TODO: check if we can avoid this by using shadow dom (react-shadow for example)
  color: ${colors.black};
  ${cssVars}
`;
