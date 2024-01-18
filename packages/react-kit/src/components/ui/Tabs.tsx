import React, { useState } from "react";
import styled, { css } from "styled-components";
import { theme } from "../../theme";
import Grid from "./Grid";

const colors = theme.colors.light;
const Headers = styled.div.attrs({ className: "headers" })<{
  $withFullViewportWidth: boolean;
}>`
  display: flex;
  gap: 1rem;
  background-color: ${colors.lightGrey};
  position: relative;
  ${({ $withFullViewportWidth }) =>
    $withFullViewportWidth &&
    css`
      &:before {
        content: "";
        width: 100vw;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        background-color: ${colors.lightGrey};
        height: 100%;
        min-height: 20px;
        z-index: -1;
      }
    `}
`;
const InnerHeaders = styled.div`
  width: 100%;
  display: flex;
  gap: 1rem;
  background-color: ${colors.lightGrey};
  overflow-x: auto;
`;
const Content = styled.div`
  width: 100%;
`;

const HeaderTab = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
`;
const TabTitle = styled.div<{ $isActive: boolean }>`
  cursor: pointer;
  width: 100%;
  span {
    font-size: 1.15rem;
    border-bottom: 3px solid;
    border-color: ${({ $isActive }) =>
      $isActive ? colors.black : "transparent"};
    font-weight: ${({ $isActive }) => ($isActive ? "600" : "normal")};
    width: 100%;
    display: block;
    text-align: center;
    padding: 1rem 0.25rem;
    white-space: nowrap;
  }
`;

type TabsData = {
  id: string;
  title: string;
  content: JSX.Element;
};

export type TabsProps = Parameters<typeof Tabs>[0];

type InnerTabsProps<T extends TabsData> = {
  data: T[] | readonly T[];
  withFullViewportWidth?: boolean;
  defaultSelectedTabId?: T["id"];
  className?: string;
};
export function Tabs<T extends TabsData>({
  data: tabsData,
  className,
  withFullViewportWidth,
  defaultSelectedTabId
}: InnerTabsProps<T>) {
  const [indexActiveTab, setIndexActiveTab] = useState(
    defaultSelectedTabId
      ? Math.max(
          tabsData.findIndex((d) => d.id === defaultSelectedTabId),
          0
        )
      : 0
  );

  const handleActive = (index: number) => () => {
    setIndexActiveTab(index);
  };
  return (
    <Grid flexDirection="column" alignItems="stretch" className={className}>
      <Headers $withFullViewportWidth={withFullViewportWidth ?? false}>
        <InnerHeaders>
          {tabsData.map((tab, index) => {
            const isActive = indexActiveTab === index;
            return (
              <HeaderTab key={tab.id}>
                <TabTitle
                  $isActive={isActive}
                  data-testid={`tab-${tab.title}`}
                  onClick={handleActive(index)}
                >
                  <span>{tab.title}</span>
                </TabTitle>
              </HeaderTab>
            );
          })}
        </InnerHeaders>
      </Headers>
      <Content>
        {tabsData.map((tab, index) => {
          const isActive = indexActiveTab === index;
          return (
            <Grid key={tab.id} flexDirection="column" alignItems="stretch">
              {isActive && <>{tab.content}</>}
            </Grid>
          );
        })}
      </Content>
    </Grid>
  );
}
