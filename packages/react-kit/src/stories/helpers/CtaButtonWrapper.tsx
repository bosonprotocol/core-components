import { ReactNode } from "react";

import { connectWallet, hooks, metaMask } from "./connect-wallet";

type Props = {
  children: ReactNode;
};

export function CtaButtonWrapper(props: Props) {
  const account = hooks.useAccount();

  return (
    <>
      {account ? (
        <>
          <div>Connected: {account}</div>
          <button onClick={() => metaMask.deactivate()}>Disconnect MM</button>
        </>
      ) : (
        <button onClick={() => connectWallet()}>Connect MM</button>
      )}
      {props.children}
    </>
  );
}
