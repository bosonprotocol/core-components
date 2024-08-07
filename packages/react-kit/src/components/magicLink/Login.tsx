import React, { useState } from "react";

import { useUser } from "./UserContext";
import { useMagic } from "../../hooks";
import { Spinner } from "../ui/loading/Spinner";
import { BaseButton } from "../buttons/BaseButton";
export type MagicLoginButtonProps = {
  buttonProps: Omit<Parameters<typeof BaseButton>[0], "onClick" | "disabled">;
};
export const MagicLoginButton = ({ buttonProps }: MagicLoginButtonProps) => {
  const magic = useMagic();
  const { setUser } = useUser();
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const connect = async () => {
    if (!magic) {
      return;
    }
    try {
      setDisabled(true);
      setLoading(true);
      const accounts = await magic.wallet.connectWithUI();
      setDisabled(false);
      localStorage.setItem("user", accounts[0]);
      setUser(accounts[0]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setDisabled(false);
    }
  };

  return (
    <BaseButton {...buttonProps} onClick={connect} disabled={disabled}>
      {loading ? (
        <>
          Loading
          <Spinner size={20} />
        </>
      ) : (
        <>Login</>
      )}
    </BaseButton>
  );
};
