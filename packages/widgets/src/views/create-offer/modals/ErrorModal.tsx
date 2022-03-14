import { Modal } from "../../../lib/components/Modal";
import { Button } from "../Button";
import { Center, Title, Value } from "./shared-styles";

interface Props {
  error: Error;
  onClose: () => void;
}

export function ErrorModal({ error, onClose }: Props) {
  return (
    <Modal>
      <Title>Error</Title>
      <Value>{error.message}</Value>
      <Center>
        <Button onClick={onClose}>Close</Button>
      </Center>
    </Modal>
  );
}
