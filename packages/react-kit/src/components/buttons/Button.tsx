import styled, { css } from "styled-components";
import React from "react";
import Loading from "../Loading";

interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  size?: "small" | "medium" | "large";
  // icon?: React.ReactNode§
  variant?:
    | "primary"
    | "secondary"
    | "tertiary"
    | "danger"
    | "ghost"
    | "warning";
  className?: string;
  children?: React.ReactNode;
}

const Button = ({
  children,
  onClick,
  className,
  size = "medium",
  variant = "primary",
  ...props
}: ButtonProps) => {
  return (
    <ButtonStyle
      variant={variant}
      className={className}
      onClick={onClick}
      {...props}
    >
      {props.loading ? <Loading /> : <span>{children}</span>}
    </ButtonStyle>
  );
};

export default Button;

const ButtonStyle = styled.button.attrs(
  (props: { size: string; variant: string }) => ({
    variant: props.variant,
    size: props.size
  })
)`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 16px 24px;
  gap: 8px;
  margin: 1px;
  cursor: pointer;
  box-shadow: 0px 0px 0px #000000;
  min-width: 200px;

  span {
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 150%;
  }

  ${(props) =>
    props.variant === "primary" &&
    !props.disabled &&
    css`
      background-color: ${({ theme }) => theme?.colors?.light.primary};
      border: 2px solid ${({ theme }) => theme?.colors?.light.primary};
      color: ${({ theme }) => theme?.colors?.light.black};
    `}

  ${(props) =>
    props.variant === "secondary" &&
    css`
      background-color: ${({ theme }) => theme?.colors?.light.secondary};
      border: 2px solid #7829f9;
      color: white;
    `}

  ${(props) =>
    props.variant === "ghost" &&
    css`
      background: transparent;
      border: 0px solid transparent;
      color: ${({ theme }) => theme?.colors?.light.secondary};
    `}

  ${(props) =>
    props.disabled &&
    css`
      background: #f1f3f9;
      opacity: 0.5;
      cursor: not-allowed;
      span {
        color: #556072;
      }
    `}
`;
