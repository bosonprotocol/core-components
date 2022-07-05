import styled from "styled-components";
import { ethers } from "ethers";

import Card from "../../components/card/card";
import CommitButton from "../../components/button/CommitButton";

export default function MainPage() {
  // ts-ignore
  const web3Provider = new ethers.providers.Web3Provider(window.ethereum);

  return (
    <MainPageContainer>
      <CommitButton
        offerId="0x0"
        web3Provider={web3Provider}
        chainId={0}
        onSuccess={({ offerId, txHash }) => {
          console.log("on success");
          console.log(
            "🚀 ~ file: index.tsx ~ line 32 ~ MainPage ~ txHash",
            txHash
          );
          console.log(
            "🚀 ~ file: index.tsx ~ line 32 ~ MainPage ~ offerId",
            offerId
          );
        }}
        onError={({ offerId, message }) => {
          console.log("on error");
          console.log(
            "🚀 ~ file: index.tsx ~ line 29 ~ MainPage ~ message",
            message
          );
          console.log(
            "🚀 ~ file: index.tsx ~ line 29 ~ MainPage ~ offerId",
            offerId
          );
        }}
        onPending={({ offerId, isLoading }) => {
          console.log("on pending");
          console.log(
            "🚀 ~ file: index.tsx ~ line 32 ~ MainPage ~ isLoading",
            isLoading
          );
          console.log(
            "🚀 ~ file: index.tsx ~ line 32 ~ MainPage ~ offerId",
            offerId
          );
        }}
      />

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
  background-color: ${({ theme }) => theme?.colors?.light.white};
`;
