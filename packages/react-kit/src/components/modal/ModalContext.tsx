/* eslint @typescript-eslint/no-empty-function: "off" */
/* eslint @typescript-eslint/no-explicit-any: "off" */
import React, { createContext, CSSProperties, ReactNode } from "react";

import { MODAL_COMPONENTS, MODAL_TYPES } from "./ModalComponents";

export type ModalProps = {
  title?: string;
  headerComponent?: ReactNode;
  footerComponent?: ReactNode;
  contentStyle?: CSSProperties;
  closable?: boolean;
  onClose?: (data: unknown | undefined | null) => void;
};
export type ModalType = keyof typeof MODAL_TYPES | null;
type ModalSize = "xxs" | "xs" | "s" | "m" | "l" | "xl";
export type Store = {
  modalType: ModalType;
  modalProps?: Parameters<ModalContextType["showModal"]>[1];
  modalSize?: ModalSize | "auto" | "fullscreen";
  modalMaxWidth?: Partial<
    Record<ModalSize, React.CSSProperties["maxWidth"]>
  > | null;
  theme?: "light" | "dark";
};
export type GenericModalProps<T extends keyof typeof MODAL_TYPES> = Parameters<
  typeof MODAL_COMPONENTS[T]
>[0] extends undefined
  ? ModalProps
  : ModalProps & Parameters<typeof MODAL_COMPONENTS[T]>[0];

export interface ModalContextType {
  showModal: <T extends keyof typeof MODAL_TYPES>(
    modalType: T,
    modalProps?: GenericModalProps<T>,
    modalSize?: Store["modalSize"],
    theme?: Store["theme"],
    modalMaxWidth?: Store["modalMaxWidth"]
  ) => void;
  hideModal: (data?: unknown | undefined | null) => void;

  updateProps: <T extends keyof typeof MODAL_TYPES>(
    store: Store & {
      modalProps: GenericModalProps<T>;
      modalSize?: Store["modalSize"];
      modalMaxWidth?: Store["modalMaxWidth"];
      theme?: Store["theme"];
    }
  ) => void;

  store: Store;
}

export const initalState: ModalContextType = {
  showModal: () => {},
  hideModal: () => {},
  updateProps: () => {},
  store: {
    modalType: null,
    modalProps: {} as any,
    modalSize: "l",
    modalMaxWidth: null,
    theme: "light"
  } as const
};

const ModalContext = createContext(initalState as ModalContextType);

export default ModalContext;
