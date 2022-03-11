import { Modal } from "../../../lib/components/Modal";
import { Button } from "../Button";
import { Center, Title, Value } from "./shared-styles";

interface Props {
  error: Error;
  onClickClose: () => void;
}

export function ErrorModal({ error, onClickClose }: Props) {
  return (
    <Modal>
      <Title>Error</Title>
      <Value>{error.message}</Value>
      <Center>
        <Button onClick={onClickClose}>Close</Button>
      </Center>
    </Modal>
  );
}
