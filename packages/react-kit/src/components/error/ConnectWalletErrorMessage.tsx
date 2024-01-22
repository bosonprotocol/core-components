import frame from "assets/frame.png";
import React from "react";
import { ErrorMessage, ErrorMessageProps } from "./ErrorMessage";
import ConnectButton from "../wallet/ConnectButton";

type ConnectWalletErrorMessageProps = Partial<
  Pick<ErrorMessageProps, "cta" | "title" | "message">
>;
export function ConnectWalletErrorMessage({
  cta,
  title,
  message
}: ConnectWalletErrorMessageProps) {
  return (
    <ErrorMessage
      cta={cta ?? <ConnectButton />}
      message={message ?? "Please connect wallet to proceed"}
      title={title ?? "Connect wallet"}
      img={<img src={frame} alt={title} />}
    />
  );
}
