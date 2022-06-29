import styled from "styled-components";
import Card from "../../components/card/card";

export default function MainPage() {
  return (
    <MainPageContainer>
      <Card
        image="https://images.unsplash.com/photo-1636718282214-0b4162a154f0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=302&q=80"
        link="#"
        onBuy={() => {
          console.log("buy");
        }}
        price="1.4"
        title="card title sds"
      />
    </MainPageContainer>
  );
}

const MainPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: ${({ theme }) => theme?.colors?.light.primary};
`;
