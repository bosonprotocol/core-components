import { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "../../state/hooks";

import { useCloseModal } from "./hooks";
import { updateChainId } from "./reducer";
import {
  useAccount,
  useChainId,
  useProvider
} from "../../hooks/connection/connection";
import useIsWindowVisible from "../../hooks/uniswap/useIsWindowVisible";
import { useDebounce } from "../../hooks/uniswap/useDebounce";

export function ApplicationUpdater(): null {
  const chainId = useChainId();
  const provider = useProvider();
  const { address: account } = useAccount();

  const dispatch = useAppDispatch();
  const windowVisible = useIsWindowVisible();

  const [activeChainId, setActiveChainId] = useState(chainId);

  const closeModal = useCloseModal();
  const previousAccountValue = useRef(account);
  useEffect(() => {
    if (account && account !== previousAccountValue.current) {
      previousAccountValue.current = account;
      closeModal();
    }
  }, [account, closeModal]);

  useEffect(() => {
    if (provider && chainId && windowVisible) {
      setActiveChainId(chainId);
    }
  }, [dispatch, chainId, provider, windowVisible]);

  const debouncedChainId = useDebounce(activeChainId, 100);

  useEffect(() => {
    const chainId = debouncedChainId
      ? /*asSupportedChain(debouncedChainId)*/ debouncedChainId
      : null;
    dispatch(updateChainId({ chainId }));
  }, [dispatch, debouncedChainId]);

  return null;
}
