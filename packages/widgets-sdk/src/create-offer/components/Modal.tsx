import React, { ReactNode } from "react";
import styled from "styled-components";
import useLockBodyScroll from "react-use/lib/useLockBodyScroll";

const Root = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 2147483647;
  background-color: #0006;
`;

interface Props {
  children: ReactNode;
}

export function Modal({ children }: Props) {
  useLockBodyScroll();

  return <Root>{children}</Root>;
}
