import styled, { css } from "styled-components";
import { colors } from "../../theme";

export const cssVars = css`
  --l: 50%;
  --headerBgColor: ${colors.white};
  --headerTextColor: ${colors.greyDark};
  --primary: ${colors.green};
  --secondary: ${colors.greyLight};
  --accent: ${colors.violet};
  --accentDark: ${colors.arsenic};
  --textColor: ${colors.black};
  --primaryBgColor: ${colors.white};
  --footerBgColor: ${colors.black};
  --footerTextColor: ${colors.white};
  --buttonBgColor: ${colors.green};
  --buttonTextColor: ${colors.black};
`;

export const ResetStylesForNonWidgets = styled.div`
  // TODO: check if we can avoid this by using shadow dom (react-shadow for example)
  color: ${colors.black};
  ${cssVars}
`;
