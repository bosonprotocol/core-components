import React, { ReactNode } from "react";
import store from "../../state";
import { ReduxCCDummyContext } from "../../state/reduxContext";
import { Provider } from "react-redux";

export type WithReduxProviderProps = {
  children: ReactNode;
  withReduxProvider: boolean;
  withCustomReduxContext: boolean;
};
export const WithReduxProvider = ({
  children,
  withReduxProvider,
  withCustomReduxContext
}: WithReduxProviderProps) => {
  return withReduxProvider ? (
    <ReduxProvider withCustomContext={withCustomReduxContext}>
      {children}
    </ReduxProvider>
  ) : (
    <>{children}</>
  );
};

export const ReduxProvider = ({
  children,
  withCustomContext = true
}: {
  children: ReactNode;
  withCustomContext?: boolean;
}) => {
  return (
    <Provider
      store={store}
      // it doesnt matter what the initial value of the context is, hence the any cast
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      context={withCustomContext ? (ReduxCCDummyContext as any) : undefined}
    >
      {children}
    </Provider>
  );
};
