import { ButtonSize } from "./Button";
import styled, { css } from "styled-components";

export const ButtonStyle = styled.button.attrs(
  (props: { size: ButtonSize; variant: string }) => ({
    variant: props.variant,
    size: props.size
  })
)`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 1rem 1.5px;
  gap: 0.5rem;
  margin: 1px;
  cursor: pointer;
  box-shadow: 0px 0px 0px #000000;
  min-width: 200px;

  #buttonText {
    font-style: normal;
    font-weight: 600;
    font-size: 1rem;
    line-height: 150%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  ${({ size }) =>
    size === ButtonSize.Small &&
    css`
      height: 2.125rem;
      padding: 0.5rem 1rem;
      #buttonText {
        font-size: 0.75rem;
      }
    `}

  ${({ size }) =>
    size === ButtonSize.Medium &&
    css`
      height: 2.813rem;
      padding: 0.75rem 1.5rem;
      #buttonText {
        font-size: 0.875rem;
      }
    `}

  ${({ size }) =>
    size === ButtonSize.Large &&
    css`
      padding: 1rem 2rem;
      height: 3.5rem;
      #buttonText {
        font-size: 1rem;
      }
    `}

  ${({ variant, disabled }) =>
    variant === "primary" &&
    !disabled &&
    css`
      background-color: ${({ theme }) => theme?.colors?.light.primary};
      border: 2px solid ${({ theme }) => theme?.colors?.light.primary};
      color: ${({ theme }) => theme?.colors?.light.black};
    `}

  ${({ variant, disabled }) =>
    variant === "secondary" &&
    !disabled &&
    css`
      background-color: ${({ theme }) => theme?.colors?.light.secondary};
      border: 2px solid #7829f9;
      color: white;
    `}
  
    ${({ variant, disabled }) =>
    variant === "ghost" &&
    !disabled &&
    css`
      background: transparent;
      border: 0px solid transparent;
      color: ${({ theme }) => theme?.colors?.light.secondary};
    `}
  
    ${({ disabled }) =>
    disabled &&
    css`
      background: #f1f3f9;
      opacity: 0.5;
      cursor: not-allowed;
      span {
        color: #556072;
      }
    `}
`;
