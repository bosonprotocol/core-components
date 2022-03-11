import { Modal } from "../../../lib/components/Modal";
import { Button } from "../Button";
import { closeWidget } from "../closeWidget";
import { Center, Title, Value } from "./shared-styles";

interface Props {
  error: Error;
}

export function ErrorModal({ error }: Props) {
  return (
    <Modal>
      <Title>Error</Title>
      <Value>{error.message}</Value>
      <Center>
        <Button onClick={closeWidget}>Close</Button>
      </Center>
    </Modal>
  );
}
