import { css, RuleSet } from "styled-components";

export const applyTouchDeviceStyles = (styles: RuleSet<object>) => css`
  @media (hover: none) and (pointer: coarse) {
    ${styles}
  }
`;
export const applyNonTouchDeviceStyles = (styles: RuleSet<object>) => css`
  @media (hover: hover) and (pointer: fine) {
    ${styles}
  }
`;
