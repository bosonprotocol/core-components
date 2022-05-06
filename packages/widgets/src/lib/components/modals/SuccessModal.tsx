import { Modal } from "./Modal";
import { Button } from "../Button";
import { Title, Label, Value, Center } from "./shared-styles";

interface Props {
  txHash: string;
  dataToPreview: { label: string; value: string };
  onClose: () => void;
}

export function SuccessModal({ txHash, dataToPreview, onClose }: Props) {
  return (
    <Modal>
      <Title>Success</Title>
      <Label>Tx Hash</Label>
      <Value>{txHash}</Value>
      <Label>{dataToPreview.label}</Label>
      <Value>{dataToPreview.value}</Value>
      <Center>
        <Button onClick={onClose}>Close</Button>
      </Center>
    </Modal>
  );
}
