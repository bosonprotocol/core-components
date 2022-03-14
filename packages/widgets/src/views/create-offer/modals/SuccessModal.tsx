import { Modal } from "../../../lib/components/Modal";
import { Button } from "../Button";
import { Title, Label, Value, Center } from "./shared-styles";

interface Props {
  txHash: string;
  offerId: string;
  onClose: () => void;
}

export function SuccessModal({ txHash, offerId, onClose }: Props) {
  return (
    <Modal>
      <Title>Success</Title>
      <Label>Tx Hash</Label>
      <Value>{txHash}</Value>
      <Label>Offer ID</Label>
      <Value>{offerId}</Value>
      <Center>
        <Button onClick={onClose}>Close</Button>
      </Center>
    </Modal>
  );
}
