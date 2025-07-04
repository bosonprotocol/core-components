import styled, { CSSProperties, css } from "styled-components";
import { colors } from "../../../theme";
import { InputTheme } from "..";

export const TagContainer = styled.div<{
  $gap: CSSProperties["gap"];
  $paddingLeft?: CSSProperties["paddingLeft"];
}>`
  position: relative;
  width: 100%;
  border-radius: 3px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ $gap }) => $gap};
  box-sizing: border-box;
  ${({ $paddingLeft }) =>
    $paddingLeft &&
    css`
      padding-left: ${$paddingLeft};
    `};
`;

export const Helper = styled.div`
  position: absolute;
  right: 0.5rem;
  font-size: 0.7rem;
  font-weight: 600;
  opacity: 0.5;
  pointer-events: none;
  user-select: none;
  svg {
    margin-bottom: -0.15rem;
  }
`;
export const TagWrapper = styled.div`
  background-color: ${colors.greyLight};
  display: inline-block;
  padding: 0.5em 0.75em;
  margin-top: 1rem;
  border-radius: ${(props) => (props.theme as InputTheme).borderRadius || 0}px;
  .text {
    word-break: break-word;
  }
`;

export const Close = styled.span`
  color: ${colors.greyDark};
  border-radius: 50%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin-left: 0.5em;
  font-size: 1.125rem;
  cursor: pointer;
`;
