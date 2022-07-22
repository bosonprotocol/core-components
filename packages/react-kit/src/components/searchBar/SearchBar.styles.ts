import styled, { css } from "styled-components";

export const InputWrapper = styled.div.attrs(
  (props: { disabled: boolean }) => ({
    disabled: props.disabled
  })
)`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0.5rem 1rem;
  gap: 1rem;
  height: 2.5rem;
  left: 1.25rem;
  background: ${({ theme }) => theme?.colors?.light.lightGrey};
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
  background-color: ${({ theme }) => theme?.colors?.light.lightGrey};
  font-size: 1rem;
  line-height: 150%;
  vertical-align: middle;
  :focus {
    outline: none;
    color: ${({ theme }) => theme?.colors?.light.secondary};
  }
  :focus::placeholder {
    color: transparent;
  }
`;
