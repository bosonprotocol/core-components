import { Modal } from "./Modal";
import { Button } from "../Button";
import { Center, Title, Value } from "./shared-styles";

interface Props {
  message: string;
  onClose: () => void;
  buttonLabel?: string;
}

export function ErrorModal({ message, onClose, buttonLabel = "Close" }: Props) {
  return (
    <Modal>
      <Title>Error</Title>
      <Value>{message} </Value>
      <Center>
        <Button onClick={onClose}>{buttonLabel}</Button>
      </Center>
    </Modal>
  );
}
