import styled, { css } from "styled-components";
import { colors } from "../../theme";

export const InputWrapper = styled.div<{ disabled?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0.5rem 1rem;
  gap: 1rem;
  height: 2.5rem;
  left: 1.25rem;
  background: ${colors.greyLight};
  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.5;
    `}
`;

export const InputField = styled.input`
  border: none;
  height: 1.563rem;
  width: 100%;
  background-color: ${colors.greyLight};
  font-size: 1rem;
  line-height: 150%;
  vertical-align: middle;
  &:focus {
    outline: none;
    color: ${colors.violet};
  }
  &:focus::placeholder {
    color: transparent;
  }
`;
