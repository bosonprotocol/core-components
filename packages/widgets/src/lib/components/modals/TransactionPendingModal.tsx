import { Modal } from "./Modal";
import { SpinnerCircular } from "spinners-react";
import { Title, Label, Value, Center } from "./shared-styles";
import { colors } from "../../colors";

interface Props {
  status: "awaiting-confirm" | "pending";
  txHash?: string;
}

export function TransactionPendingModal({ status, txHash }: Props) {
  return (
    <Modal>
      <Title>
        {status === "awaiting-confirm"
          ? "Awaiting User Confirmation"
          : "Transaction Processing"}
      </Title>
      {txHash && (
        <>
          <Label>Tx Hash</Label>
          <Value>{txHash}</Value>
        </>
      )}
      <Center>
        <SpinnerCircular className="" size={80} color={colors.neonGreen} />
      </Center>
    </Modal>
  );
}
