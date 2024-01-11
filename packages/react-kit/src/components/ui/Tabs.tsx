import React, { useState } from "react";
import styled from "styled-components";
import { theme } from "../../theme";
import Grid from "./Grid";

const colors = theme.colors.light;
const Headers = styled.div.attrs({ className: "headers" })`
  display: flex;
  gap: 1rem;
  background-color: ${colors.lightGrey};
  overflow-x: auto;
  /* width: 100vw;
  margin-left: -50%;
  transform: translateX(50%);
  position: absolute;
  left: 0; */
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

interface Props {
  data: TabsData[];
}
export function Tabs({ data: tabsData }: Props) {
  const [indexActiveTab, setIndexActiveTab] = useState(0);

  const handleActive = (index: number) => () => {
    setIndexActiveTab(index);
  };
  return (
    <Grid flexDirection="column" alignItems="stretch">
      <Headers>
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
