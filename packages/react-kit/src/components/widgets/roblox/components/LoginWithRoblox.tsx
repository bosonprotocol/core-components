import { useRobloxConfigContext } from "../../../../hooks/roblox/context/useRobloxConfigContext";
import { BaseButton } from "../../../buttons/BaseButton";
import React from "react";
import { CardThemeProps } from "./types";
import { useIsRobloxLoggedIn } from "../../../../hooks/roblox/useIsRobloxLoggedIn";
import { useAccount } from "../../../../hooks";

export type LoginWithRobloxProps = {
  onLoggedIn?: () => unknown;
  onDisconecctWallet?: () => unknown;
  robloxButtonTheme: CardThemeProps["button"];
  sellerId: string;
};
export const LoginWithRoblox = ({
  onLoggedIn,
  onDisconecctWallet,
  robloxButtonTheme,
  sellerId
}: LoginWithRobloxProps) => {
  const { backendOrigin } = useRobloxConfigContext();
  const { address = "" } = useAccount();
  const { refetch: getIsRobloxLoggedInAsync } = useIsRobloxLoggedIn({
    sellerId,
    options: {
      enabled: true,
      onSuccess: (data) => {
        if (!data?.isLoggedIn && address) {
          onDisconecctWallet?.();
        }
      }
    }
  });
  return (
    <BaseButton
      theme={robloxButtonTheme.active}
      onClick={() => {
        window.open(`${backendOrigin}/login`, "_blank");
        const id = setInterval(async () => {
          try {
            const { data } = await getIsRobloxLoggedInAsync();
            if (data) {
              const { isLoggedIn } = data;
              if (isLoggedIn) {
                clearInterval(id); // stop polling once the user is logged in
                onLoggedIn?.();
                return;
              }
            }
          } catch (error) {
            clearInterval(id); // something went wrong, stop polling
          }
        }, 1000);
      }}
    >
      Login with Roblox
    </BaseButton>
  );
};
