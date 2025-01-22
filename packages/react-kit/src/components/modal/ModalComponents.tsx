import { ImageEditorModal } from "../form/Upload/ImageEditorModal/ImageEditorModal";
import { MODAL_TYPES } from "./ModalTypes";
import FinanceDeposit from "./components/SellerFinance/FinanceDeposit";
import FinanceWithdraw from "./components/SellerFinance/FinanceWithdraw";
import TransactionFailedModal from "./components/Transactions/TransactionFailedModal/TransactionFailedModal";
import TransactionSubmittedModal from "./components/Transactions/TransactionSubmittedModal/TransactionSubmittedModal";
import WaitingForConfirmationModal from "./components/Transactions/WaitingForConfirmationModal/WaitingForConfirmationModal";
import { RequestShipmentModal } from "./components/RequestShipment/RequestShipmentModal";

export const MODAL_COMPONENTS = {
  [MODAL_TYPES.FINANCE_DEPOSIT_MODAL]: FinanceDeposit,
  [MODAL_TYPES.FINANCE_WITHDRAW_MODAL]: FinanceWithdraw,
  [MODAL_TYPES.TRANSACTION_FAILED]: TransactionFailedModal,
  [MODAL_TYPES.TRANSACTION_SUBMITTED]: TransactionSubmittedModal,
  [MODAL_TYPES.WAITING_FOR_CONFIRMATION]: WaitingForConfirmationModal,
  [MODAL_TYPES.IMAGE_EDITOR]: ImageEditorModal,
  [MODAL_TYPES.REQUEST_SHIPMENT]: RequestShipmentModal
} as const;
