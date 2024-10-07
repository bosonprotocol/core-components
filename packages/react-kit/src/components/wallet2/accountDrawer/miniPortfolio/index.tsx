import React, { useState } from "react";
import styled from "styled-components";

import { Grid } from "../../../ui/Grid";
import { Typography } from "../../../ui/Typography";
import Tokens, { TokensProps } from "./tokens";
import { breakpointNumbers } from "../../../../lib/ui/breakpoint";
import { Column } from "../../../ui/column";

const Wrapper = styled(Column)`
  margin-top: 28px;
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 12px;

  @media screen and (max-width: ${breakpointNumbers.s}px) {
    margin-bottom: 48px;
  }
`;

const Nav = styled(Grid)`
  gap: 20px;
`;

const NavItem = styled(Typography)`
  align-items: center;
  display: flex;
  justify-content: space-between;
  transition: 250ms ease color;
`;

const PageWrapper = styled.div`
  border-radius: 12px;
  margin-right: -16px;
  margin-left: -16px;
  width: calc(100% + 32px);
  flex: 1;
`;

interface Page {
  title: React.ReactNode;
  key: string;
  component: ({ account }: MiniPortfolioProps) => JSX.Element;
}

const Pages: Array<Page> = [
  {
    title: "Tokens",
    key: "tokens",
    component: Tokens
  }
];

export type MiniPortfolioProps = TokensProps;
export default function MiniPortfolio({
  account,
  defaultTokens
}: MiniPortfolioProps) {
  const [currentPage, setCurrentPage] = useState(0);

  const { component: Page } = Pages[currentPage];

  return (
    <Wrapper>
      <Nav data-testid="mini-portfolio-navbar">
        {Pages.map(({ title, key }, index) => {
          const handleNavItemClick = () => {
            setCurrentPage(index);
          };
          return (
            <NavItem onClick={handleNavItemClick} key={key}>
              <span>{title}</span>
            </NavItem>
          );
        })}
      </Nav>
      <PageWrapper data-testid="mini-portfolio-page">
        <Page account={account} defaultTokens={defaultTokens} />
      </PageWrapper>
    </Wrapper>
  );
}
