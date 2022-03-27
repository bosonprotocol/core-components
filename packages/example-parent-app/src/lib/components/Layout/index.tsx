import { ReactNode } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import eclipse from "./eclipse.svg";

const Root = styled.div`
  position: relative;
  width: 100vw;
  max-width: 100%;
  min-height: 100vh;
  overflow: hidden;
`;

const Blur = styled.div`
  width: 590px;
  height: 590px;
  background: linear-gradient(
    180deg,
    rgba(253, 63, 129, 0.3) 0%,
    rgba(112, 62, 255, 0.3) 100%
  );
  filter: blur(200px);
  position: absolute;
  right: 0;
  top: -126px;
  z-index: -1;
`;

const Image = styled.img`
  object-fit: cover;
  object-position: center 105px;
  width: 100%;
`;

const ImageContainer = styled.div`
  z-index: -2;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: hidden;
  user-select: none;
  pointer-events: none;
  background-color: #090c16;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1000px;
  margin: auto;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 80px;
  align-items: center;
`;

const StyledLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 16px;
  & + & {
    margin-left: 24px;
  }
`;

const Title = styled.div`
  font-size: 32px;
`;

interface IProps {
  children: ReactNode;
}

export function Layout({ children }: IProps) {
  return (
    <Root>
      <ImageContainer>
        <Image src={eclipse} alt="eclipse" />
      </ImageContainer>
      <Blur />
      <Content>
        <TopBar>
          <Title>Example Marketplace</Title>
          <div>
            <StyledLink to="/">Create offer</StyledLink>
            <StyledLink to="/manage">Manage offer</StyledLink>
          </div>
        </TopBar>
        {children}
      </Content>
    </Root>
  );
}
