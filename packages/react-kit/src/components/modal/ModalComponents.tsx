import { MODAL_TYPES } from "./ModalTypes";
import FinanceDeposit from "./components/SellerFinance/FinanceDeposit";
import FinanceWithdraw from "./components/SellerFinance/FinanceWithdraw";
import TransactionFailedModal from "./components/Transactions/TransactionFailedModal/TransactionFailedModal";
import TransactionSubmittedModal from "./components/Transactions/TransactionSubmittedModal/TransactionSubmittedModal";
import WaitingForConfirmationModal from "./components/Transactions/WaitingForConfirmationModal/WaitingForConfirmationModal";

export const MODAL_COMPONENTS = {
  [MODAL_TYPES.FINANCE_DEPOSIT_MODAL]: FinanceDeposit,
  [MODAL_TYPES.FINANCE_WITHDRAW_MODAL]: FinanceWithdraw,
  [MODAL_TYPES.TRANSACTION_FAILED]: TransactionFailedModal,
  [MODAL_TYPES.TRANSACTION_SUBMITTED]: TransactionSubmittedModal,
  [MODAL_TYPES.WAITING_FOR_CONFIRMATION]: WaitingForConfirmationModal
} as const;
