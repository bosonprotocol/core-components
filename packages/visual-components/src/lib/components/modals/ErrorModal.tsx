import { Modal } from "./Modal";
import { Button } from "../Button";
import { Center, Title, Value } from "./shared-styles";

type ValidationError = Error & {
  errors: string[];
  value: Record<string, unknown>;
};

interface Props {
  message?: string;
  error?: Error;
  onClose: () => void;
  buttonLabel?: string;
}

export function ErrorModal({
  message,
  error,
  onClose,
  buttonLabel = "Close"
}: Props) {
  return (
    <Modal>
      <Title>Error</Title>
      <Value>
        {message ||
          formatErrorMessage(error) ||
          "Whoops something went wrong..."}
      </Value>
      <Center>
        <Button onClick={onClose}>{buttonLabel}</Button>
      </Center>
    </Modal>
  );
}

function formatErrorMessage(error?: Error | ValidationError) {
  if (!error) {
    return "";
  }

  if (error.name === "ValidationError") {
    const err = error as ValidationError;
    return JSON.stringify(
      { providedValue: err.value, validationError: err.errors },
      null,
      2
    );
  }

  return error.message;
}
