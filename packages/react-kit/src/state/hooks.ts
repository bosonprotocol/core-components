/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createDispatchHook,
  createSelectorHook,
  TypedUseSelectorHook
} from "react-redux";

import store from "./index";
import { ReduxCCDummyContext } from "./reduxContext";
import { useConfigContext } from "../components/config/ConfigContext";

export const useAppDispatch = () => {
  const { withCustomReduxContext } = useConfigContext();
  const useDappDispatch = createDispatchHook(
    withCustomReduxContext ? (ReduxCCDummyContext as any) : undefined
  );
  return useDappDispatch<typeof store.dispatch>();
};
export const useAppSelector: TypedUseSelectorHook<
  ReturnType<typeof store.getState>
> = () => {
  const { withCustomReduxContext } = useConfigContext();

  return createSelectorHook(
    withCustomReduxContext ? (ReduxCCDummyContext as any) : undefined
  );
};
