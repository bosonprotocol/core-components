import styled from "styled-components";
import { Modal } from "../../lib/components/Modal";
import { SpinnerCircular } from "spinners-react";

const Title = styled.div`
  font-size: 24px;
  text-align: center;
  margin-bottom: 16px;
  color: #f0f0f0;
`;

const Label = styled.div`
  font-weight: 500;
  font-size: 14px;
  user-select: none;
  margin-bottom: 8px;
  color: #f0f0f0;
`;

const Value = styled.div`
  padding: 4px 8px;
  border: 2px solid #5e5e5e;
  background-color: #ced4db;
  color: #333333;
  border-radius: 4px;
  margin-bottom: 24px;
  font-size: 14px;
`;

const Center = styled.div`
  display: flex;
  justify-content: center;
`;

interface Props {
  txHash: string;
}
export function TransactionProcessingModal({ txHash }: Props) {
  return (
    <Modal>
      <Title>Transaction Processing</Title>
      <Label>Tx Hash</Label>
      <Value>{txHash}</Value>
      <Center>
        <SpinnerCircular className="" size={80} color="#ced4db" />
      </Center>
    </Modal>
  );
}
