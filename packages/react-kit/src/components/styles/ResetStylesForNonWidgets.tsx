import styled, { css } from "styled-components";
import { colors } from "../../theme";
import { isTruthy } from "../../types/helpers";

export const cssVars = css`
  --l: 50%;
  --headerBgColor: ${colors.white};
  --headerTextColor: ${colors.greyDark};
  --primary: ${colors.green};
  --secondary: ${colors.greyLight};
  --accent: ${colors.violet};
  --textColor: ${colors.black};
  --footerBgColor: ${colors.black};
  --footerTextColor: ${colors.white};
  --buttonBgColor: ${colors.green};
  --buttonTextColor: ${colors.black};

  ${({ theme }) =>
    Object.keys(theme)
      .filter((key) => key.startsWith("--"))
      .map((key) => {
        const value = theme[key];
        if (!value) {
          return null;
        }
        return css`
          ${key}:${value};
        `;
      })
      .filter(isTruthy)};
`;

export const ResetStylesForNonWidgets = styled.div`
  // TODO: check if we can avoid this by using shadow dom (react-shadow for example)
  color: ${colors.black};
  ${cssVars}
`;
