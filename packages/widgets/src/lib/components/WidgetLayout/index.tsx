import { ReactNode } from "react";
import styled from "styled-components";

const Title = styled.h1`
  color: red;
`;

interface Props {
  children: ReactNode;
}

export function WidgetLayout({ children }: Props) {
  return (
    <>
      <Title>layout title</Title>
      {children}
    </>
  );
}
