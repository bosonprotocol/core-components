import { Modal } from "./Modal";
import { Button } from "../Button";
import { Center, Title } from "./shared-styles";
import styled from "styled-components";

const PrimaryButton = styled(Button)`
  width: 100px;
`;

const SecondaryButton = styled(PrimaryButton)`
  background-color: #ced4db;
`;

const StyledTitle = styled(Title)`
  margin-bottom: 40px;
`;

interface Props {
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({ onCancel, onConfirm }: Props) {
  return (
    <Modal>
      <StyledTitle>Confirm Action</StyledTitle>
      <Center>
        <SecondaryButton onClick={onCancel}>Close</SecondaryButton>
        <PrimaryButton style={{}} onClick={onConfirm}>
          Proceed
        </PrimaryButton>
      </Center>
    </Modal>
  );
}
