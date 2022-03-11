import { Modal } from "../../../lib/components/Modal";
import { Button } from "../Button";
import { closeWidget } from "../closeWidget";
import { Title, Label, Value, Center } from "./shared-styles";

interface Props {
  txHash: string;
  offerId: string;
}

export function SucessModal({ txHash, offerId }: Props) {
  return (
    <Modal>
      <Title>Success</Title>
      <Label>Tx Hash</Label>
      <Value>{txHash}</Value>
      <Label>Offer ID</Label>
      <Value>{offerId}</Value>
      <Center>
        <Button onClick={closeWidget}>Close</Button>
      </Center>
    </Modal>
  );
}
