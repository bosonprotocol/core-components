import { ReactNode } from "react";
import styled from "styled-components";
import { zIndex } from "../../zIndex";

const Root = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #0004;
  z-index: ${zIndex.modal};
`;

const Content = styled.div`
  margin: 24px;
  color: white;
  min-width: 300px;
  border-radius: 8px;
  padding: 16px;
  background-color: #43464f;
  border: 2px solid #c1c1c1;
`;

interface Props {
  children: ReactNode;
}

export function Modal({ children }: Props) {
  return (
    <Root>
      <Content>{children}</Content>
    </Root>
  );
}
