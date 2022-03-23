import { Modal } from "./Modal";
import { Button } from "../Button";
import { Center, Title, Value } from "./shared-styles";

interface Props {
  message: string;
  onClose: () => void;
}

export function ErrorModal({ message, onClose }: Props) {
  return (
    <Modal>
      <Title>Error</Title>
      <Value>{message} </Value>
      <Center>
        <Button onClick={onClose}>Close</Button>
      </Center>
    </Modal>
  );
}
