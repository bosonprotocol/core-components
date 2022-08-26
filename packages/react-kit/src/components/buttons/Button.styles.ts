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
  /* min-width: 200px; */

  transition: all ${({ theme }) => theme?.transition?.time || "150ms"}
    ${({ theme }) => theme?.transition?.timing || "ease-in-out"};
  svg {
    transition: all ${({ theme }) => theme?.transition?.time || "150ms"}
      ${({ theme }) => theme?.transition?.timing || "ease-in-out"};
  }

  span[data-loading="true"] {
    transition: all ${({ theme }) => theme?.transition?.time || "150ms"}
      ${({ theme }) => theme?.transition?.timing || "ease-in-out"};
    border-bottom-color: ${({ theme }) => theme?.colors?.light.black};
  }

  svg > *:not(rect[fill="none"]) {
    stroke: inherit;
  }

  #buttonText {
    font-style: normal;
    font-weight: 500;
    font-size: 1rem;
    line-height: 1.5;
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

      // CSS VARIANTS STYLES
  ${({ variant, disabled }) =>
    variant === "primary" &&
    !disabled &&
    css`
      background: ${({ theme }) => theme?.colors?.light.primary};
      background-color: ${({ theme }) => theme?.colors?.light.primary};
      border-width: 0;
      color: ${({ theme }) => theme?.colors?.light.black};
      svg {
        stroke: ${({ theme }) => theme?.colors?.light.black};
      }
      :hover {
        background: ${({ theme }) => theme?.colors?.light.black};
        background-color: ${({ theme }) => theme?.colors?.light.black};
        color: ${({ theme }) => theme?.colors?.light.white};
        svg {
          stroke: ${({ theme }) => theme?.colors?.light.white};
        }
      }
    `}

  ${({ variant, disabled }) =>
    variant === "primaryOutline" &&
    !disabled &&
    css`
      background: ${({ theme }) => theme?.colors?.light.white};
      background-color: ${({ theme }) => theme?.colors?.light.white};
      border: 2px solid ${({ theme }) => theme?.colors?.light.primary};
      color: ${({ theme }) => theme?.colors?.light.black};
      svg {
        stroke: ${({ theme }) => theme?.colors?.light.black};
      }
      :hover {
        background: ${({ theme }) => theme?.colors?.light.lightGrey};
        background-color: ${({ theme }) => theme?.colors?.light.lightGrey};
        border: 2px solid ${({ theme }) => theme?.colors?.light.black};
        color: ${({ theme }) => theme?.colors?.light.black};
        svg {
          stroke: ${({ theme }) => theme?.colors?.light.black};
        }
      }
    `}

  ${({ variant, disabled }) =>
    variant === "secondary" &&
    !disabled &&
    css`
      background: ${({ theme }) => theme?.colors?.light.secondary};
      background-color: ${({ theme }) => theme?.colors?.light.secondary};
      border-width: 0;
      color: ${({ theme }) => theme?.colors?.light.white};
      svg {
        stroke: ${({ theme }) => theme?.colors?.light.white};
      }
      :hover {
        background: ${({ theme }) => theme?.colors?.light.black};
        background-color: ${({ theme }) => theme?.colors?.light.black};
        color: ${({ theme }) => theme?.colors?.light.white};
        svg {
          stroke: ${({ theme }) => theme?.colors?.light.white};
        }
      }
    `}

    ${({ variant, disabled }) =>
    variant === "secondaryOutline" &&
    !disabled &&
    css`
      background: ${({ theme }) => theme?.colors?.light.white};
      background-color: ${({ theme }) => theme?.colors?.light.white};
      border: 2px solid ${({ theme }) => theme?.colors?.light.secondary};
      color: ${({ theme }) => theme?.colors?.light.secondary};
      svg {
        stroke: ${({ theme }) => theme?.colors?.light.secondary};
      }
      :hover {
        background: ${({ theme }) => theme?.colors?.light.lightGrey};
        background-color: ${({ theme }) => theme?.colors?.light.lightGrey};
        border: 2px solid ${({ theme }) => theme?.colors?.light.black};
        color: ${({ theme }) => theme?.colors?.light.black};
        svg {
          stroke: ${({ theme }) => theme?.colors?.light.black};
        }
      }
    `}

    ${({ variant, disabled }) =>
    variant === "ghost" &&
    !disabled &&
    css`
      background: ${({ theme }) => theme?.colors?.light.white};
      background-color: ${({ theme }) => theme?.colors?.light.white};
      border-width: 0;
      color: ${({ theme }) => theme?.colors?.light.darkGrey};
      svg {
        stroke: ${({ theme }) => theme?.colors?.light.darkGrey};
      }
      :hover {
        background: ${({ theme }) => theme?.colors?.light.lightGrey};
        background-color: ${({ theme }) => theme?.colors?.light.lightGrey};
        color: ${({ theme }) => theme?.colors?.light.black};
        svg {
          stroke: ${({ theme }) => theme?.colors?.light.black};
        }
      }
    `}
    ${({ variant, disabled }) =>
    variant === "ghostSecondary" &&
    !disabled &&
    css`
      background: ${({ theme }) => theme?.colors?.light.white};
      background-color: ${({ theme }) => theme?.colors?.light.white};
      border-width: 0;
      color: ${({ theme }) => theme?.colors?.light.secondary};
      svg {
        stroke: ${({ theme }) => theme?.colors?.light.secondary};
      }
      :hover {
        background: ${({ theme }) => theme?.colors?.light.lightGrey};
        background-color: ${({ theme }) => theme?.colors?.light.lightGrey};
        color: ${({ theme }) => theme?.colors?.light.black};
        svg {
          stroke: ${({ theme }) => theme?.colors?.light.black};
        }
      }
    `}
    ${({ variant, disabled }) =>
    variant === "ghostOrange" &&
    !disabled &&
    css`
      background: ${({ theme }) => theme?.colors?.light.white};
      background-color: ${({ theme }) => theme?.colors?.light.white};
      border-width: 0;
      color: ${({ theme }) => theme?.colors?.light.orange};
      svg {
        stroke: ${({ theme }) => theme?.colors?.light.orange};
      }
      :hover {
        background: ${({ theme }) => theme?.colors?.light.lightGrey};
        background-color: ${({ theme }) => theme?.colors?.light.lightGrey};
        color: ${({ theme }) => theme?.colors?.light.black};
        svg {
          stroke: ${({ theme }) => theme?.colors?.light.black};
        }
      }
    `}

    ${({ disabled }) =>
    disabled &&
    css`
      background: ${({ theme }) => theme?.colors?.light.lightGrey};
      background-color: ${({ theme }) => theme?.colors?.light.lightGrey};
      border: 2px solid ${({ theme }) => theme?.colors?.light.lightGrey};
      color: ${({ theme }) => theme?.colors?.light.darkGrey};
      opacity: 0.5;
      cursor: not-allowed;
      svg {
        stroke: ${({ theme }) => theme?.colors?.light.darkGrey};
      }
    `}
`;
