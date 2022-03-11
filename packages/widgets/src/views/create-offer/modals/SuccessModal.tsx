import { Modal } from "../../../lib/components/Modal";
import { Button } from "../Button";
import { Title, Label, Value, Center } from "./shared-styles";

interface Props {
  txHash: string;
  offerId: string;
  onClickClose: () => void;
}

export function SuccessModal({ txHash, offerId, onClickClose }: Props) {
  return (
    <Modal>
      <Title>Success</Title>
      <Label>Tx Hash</Label>
      <Value>{txHash}</Value>
      <Label>Offer ID</Label>
      <Value>{offerId}</Value>
      <Center>
        <Button onClick={onClickClose}>Close</Button>
      </Center>
    </Modal>
  );
}
