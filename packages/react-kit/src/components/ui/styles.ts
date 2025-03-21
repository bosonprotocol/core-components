import { css } from "styled-components";
import { breakpoint } from "../../lib/ui/breakpoint";

export const transition = css`
  transition: all 150ms ease-in-out;
`;

export const buttonText = css`
  letter-spacing: 0.5px;
  font-style: normal;
  font-size: 1rem;
  font-weight: 500;
  line-height: 24px;
`;

export const button = css`
  box-sizing: border-box;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 1rem 1.5px;
  gap: 0.5rem;
  margin: 0;
  position: relative;
  overflow: hidden;
  box-shadow: 0px 0px 0px #000000;
  ${buttonText}
  ${transition}
  svg {
    ${transition}
  }
`;
export const clamp = css`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
`;
export const boxShadow = css`
  box-shadow:
    0px 0px 4px rgba(0, 0, 0, 0.05),
    0px 0px 8px rgba(0, 0, 0, 0.05),
    0px 0px 16px rgba(0, 0, 0, 0.05),
    0px 0px 32px rgba(0, 0, 0, 0.05);
`;

export const text = css`
  letter-spacing: 0.5px;
  font-style: normal;
  font-size: 0.875rem;
  line-height: 24px;
`;

export const small = css`
  min-height: 2.125rem;
  padding: 0.5rem 1rem;
  * {
    font-size: 0.75rem;
  }
`;
export const regular = css`
  min-height: 2.813rem;
  padding: 0.75rem 1.5rem;
  * {
    font-size: 1rem;
  }
  ${breakpoint.xxs} {
    * {
      font-size: 0.875rem;
    }
  }
`;
export const large = css`
  min-height: 3.5rem;
  padding: 1rem 2rem;
  * {
    font-size: 1.125rem;
  }
  ${breakpoint.xxs} {
    * {
      font-size: 1rem;
    }
  }
`;
