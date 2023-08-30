import styled, { css } from "styled-components";

export const ExtraInfo = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  font-style: normal;
  font-weight: 600;
  font-size: 0.75rem;
  line-height: 150%;
  ${(props) =>
    props.theme?.color &&
    css`
      color: color-mix(in srgb, ${props.theme?.color} 50%, black);
    `};
  opacity: 0.5;
`;

export const ButtonTextWrapper = styled.div`
  display: flex;
  white-space: nowrap;
  gap: 0.5rem;
`;

export const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 150%;
  margin-left: 3.75rem;
`;
