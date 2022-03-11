import { Modal } from "../../../lib/components/Modal";
import { SpinnerCircular } from "spinners-react";
import { Title, Label, Value, Center } from "./shared-styles";

interface Props {
  txHash: string;
}

export function TransactionPendingModal({ txHash }: Props) {
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
