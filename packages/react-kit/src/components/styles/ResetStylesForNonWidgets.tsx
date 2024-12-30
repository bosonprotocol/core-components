import styled, { css } from "styled-components";
import { colors } from "../../theme";
import { isTruthy } from "../../types/helpers";

export const cssVars = css`
  --l: 50%;
  --primary: ${colors.green};
  --secondary: ${colors.greyLight};
  --accent: ${colors.violet};

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
