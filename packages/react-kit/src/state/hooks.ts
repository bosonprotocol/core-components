import {
  createDispatchHook,
  createSelectorHook,
  TypedUseSelectorHook
} from "react-redux";

import store from "./index";
import { ReduxCCDummyContext } from "./reduxContext";

const useDappDispatch = createDispatchHook(ReduxCCDummyContext as any);
export const useAppDispatch = () => useDappDispatch<typeof store.dispatch>();
const useDappSelector = createSelectorHook(ReduxCCDummyContext as any);
export const useAppSelector: TypedUseSelectorHook<
  ReturnType<typeof store.getState>
> = useDappSelector;
