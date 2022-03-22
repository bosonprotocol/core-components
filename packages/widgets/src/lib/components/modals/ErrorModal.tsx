import { Modal } from "./Modal";
import { Button } from "../Button";
import { Center, Title, Value } from "./shared-styles";

interface Props {
  error: Error | string;
  onClose: () => void;
}

export function ErrorModal({ error, onClose }: Props) {
  return (
    <Modal>
      <Title>Error</Title>
      <Value>{typeof error === "string" ? error : error.message} </Value>
      <Center>
        <Button onClick={onClose}>Close</Button>
      </Center>
    </Modal>
  );
}
