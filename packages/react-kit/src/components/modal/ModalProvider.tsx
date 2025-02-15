/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint @typescript-eslint/no-empty-function: "off" */
import React from "react";
import { useCallback, useState } from "react";

import Modal from "./Modal";
import { MODAL_COMPONENTS } from "./ModalComponents";
import ModalContext, {
  initalState,
  ModalContextType,
  ModalType,
  Store
} from "./ModalContext";

const RenderModalComponent = ({
  store,
  hideModal
}: {
  store: Store;
  hideModal: () => void;
}) => {
  const ModalComponent = store.modalType
    ? MODAL_COMPONENTS[store.modalType]
    : null;
  if (!store.modalType || !ModalComponent) {
    document.body.style.overflow = "";
    return null;
  }
  document.body.style.overflow = "hidden";
  return (
    <Modal
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      size={store.modalSize || initalState.store.modalSize!}
      maxWidths={store.modalMaxWidth || initalState.store.modalMaxWidth}
      hideModal={hideModal}
      title={store.modalProps?.title}
      headerComponent={store.modalProps?.headerComponent}
      footerComponent={store.modalProps?.footerComponent}
      contentStyle={store.modalProps?.contentStyle}
      closable={store.modalProps?.closable}
      modalType={store.modalType}
    >
      <ModalComponent
        id="modal"
        {...(store.modalProps as any)}
        hideModal={hideModal}
      />
    </Modal>
  );
};

interface Props {
  children: React.ReactNode;
}
export function ModalProvider({ children }: Props) {
  const [store, setStore] = useState(initalState.store);

  const showModal = useCallback(
    (
      modalType: ModalType,
      modalProps?: Store["modalProps"],
      modalSize?: Store["modalSize"],
      modalMaxWidth?: Store["modalMaxWidth"]
    ) => {
      setStore({
        ...store,
        modalType,
        modalProps,
        modalSize,
        modalMaxWidth
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [store]
  );

  const hideModal = useCallback(
    (data?: unknown | undefined | null) => {
      setStore({
        ...store,
        modalType: null,
        modalProps: {} as Store["modalProps"]
      });
      store?.modalProps?.onClose?.(data);
    },
    [store]
  );

  const updateProps = useCallback((store: Store) => {
    setStore({
      ...store
    });
  }, []);

  // TODO: check if this is necessary
  // const { pathname } = useLocation();
  // useEffect(() => {
  //   if (store.modalType !== null) {
  //     hideModal();
  //   }
  // }, [pathname]); // eslint-disable-line

  const value: ModalContextType = {
    store,
    updateProps,
    showModal,
    hideModal
  } as ModalContextType;

  return (
    <ModalContext.Provider value={value}>
      {children}
      <RenderModalComponent store={store} hideModal={hideModal} />
    </ModalContext.Provider>
  );
}
