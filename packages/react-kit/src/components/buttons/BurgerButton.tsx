import styled, { CSSProperties } from "styled-components";
import React from "react";

const Button = styled.button<{
  $backgroundColor: CSSProperties["backgroundColor"];
}>`
  all: unset;
  cursor: pointer;

  position: relative;

  display: flex;
  flex-direction: column;
  gap: 3px;
  margin: 0.5rem;
  padding: 0.5rem;
  > div {
    width: 1.25rem;
    height: 2px;
    border-radius: 5px;
    background-color: ${({ $backgroundColor }) => $backgroundColor};
  }
`;

type BurgerButtonProps = {
  onClick: () => void;
  color: CSSProperties["backgroundColor"];
};

export const BurgerButton: React.FC<BurgerButtonProps> = ({
  onClick,
  color
}) => {
  return (
    <Button onClick={onClick} $backgroundColor={color}>
      <div />
      <div />
      <div />
    </Button>
  );
};
