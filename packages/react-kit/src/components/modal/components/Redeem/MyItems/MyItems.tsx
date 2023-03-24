import React from "react";
import styled from "styled-components";
import { useAccount } from "wagmi";
import { useBuyers } from "../../../../../hooks/useBuyers";
import Exchanges from "./Exchanges";
type Props = {
  onBackClick: () => void;
  onNextClick: () => void;
  isValid: boolean;
};

const Container = styled.div``;

export function MyItems({ onBackClick, onNextClick }: Props) {
  const { address } = useAccount();
  const { data: buyers } = useBuyers({
    wallet: address
  });
  const buyerId = buyers?.[0].id;
  if (!buyerId) {
    return <Container>You do not have any exchanges yet</Container>;
  }
  return (
    <Container>
      <Exchanges buyerId={buyerId} />
    </Container>
  );
}
