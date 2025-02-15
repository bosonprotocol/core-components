import styled, { CSSProperties, css } from "styled-components";
import { colors } from "../../theme";

export const ImageWrapper = styled.div<{ $hide?: boolean }>`
  display: ${({ $hide }) => ($hide ? "none !important" : undefined)};
  overflow: hidden;
  position: relative;
  z-index: 2;
  display: flex;
  padding-top: 120%;
  font-size: inherit;
`;

export const ImageHtml = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const buttonText = css`
  letter-spacing: 0.5px;
  font-style: normal;
  font-size: 1rem;
  font-weight: 500;
  line-height: 24px;
`;

export const ImagePlaceholder = styled.div<{
  $position?: CSSProperties["position"];
}>`
  ${({ $position }) =>
    $position
      ? css`
          position: ${$position};
        `
      : css`
          position: absolute;
        `}
  top: 0;
  height: 100%;
  width: 100%;
  background-color: ${colors.greyDark};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  span {
    ${buttonText}
    font-size: inherit;
    line-height: 1;
    color: ${colors.white};
    padding: 1rem;
    text-align: center;
  }
`;

export const ImageErrorText = styled.div`
  ${buttonText}
  font-size: inherit;
  line-height: 1;
  color: ${colors.white};
  text-align: center;
  padding: 0.5rem;
`;
