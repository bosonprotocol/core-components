import { Modal } from "./Modal";
import { Button } from "../Button";
import { Title, Label, Value, Center } from "./shared-styles";

interface Props {
  message?: string;
  txHash: string;
  dataToPreview?: { label: string; value: string };
  onClose: () => void;
}

export function SuccessModal({
  message = "Success",
  txHash,
  dataToPreview,
  onClose
}: Props) {
  return (
    <Modal>
      <Title>{message}</Title>
      <Label>Tx Hash</Label>
      <Value>{txHash}</Value>
      {dataToPreview && (
        <>
          <Label>{dataToPreview.label}</Label>
          <Value>{dataToPreview.value}</Value>
        </>
      )}
      <Center>
        <Button onClick={onClose}>Close</Button>
      </Center>
    </Modal>
  );
}
