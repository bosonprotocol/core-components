import { formatBytes32String } from "ethers/lib/utils";
import { useAccount, useWeb3SignTypedData } from "../connection/connection";
import { GetLoggedInResponse } from "./backend.types";
import { useMutation } from "react-query";
import { useDisconnect } from "../connection/useDisconnect";
import { usePostRobloxWalletAuth } from "./usePostRobloxWalletAuth";

const domainValues = {
  name: "Boson-Roblox-Bridge",
  version: "1"
};

export function prepareAuthSignature(
  claims: { sub: string; name: string },
  nonce: string,
  sellerId: string
) {
  const domain = {
    ...domainValues,
    salt: formatBytes32String(nonce.slice(0, 31))
  };
  const AuthSignature = [
    {
      name: "value",
      type: "string"
    }
  ];
  const types = { AuthSignature };
  const message = {
    value: `Authentication Roblox User: ${claims.name}, Id: ${claims.sub}, Nonce: ${nonce}, Seller: ${sellerId}`
  };
  const EIP712Domain = [
    { name: "name", type: "string" },
    { name: "version", type: "string" },
    { name: "salt", type: "bytes32" }
  ];
  const dataToSign = {
    types: {
      EIP712Domain,
      AuthSignature
    },
    domain,
    primaryType: "AuthSignature" as const,
    message
  }; // Message to be signed by the wallet on Frontend
  return { domain, types, message, dataToSign };
}

type UseRobloxBackendLoginProps = {
  loggedInData: GetLoggedInResponse | undefined | null;
  sellerId: string;
  mutationKey: unknown[];

  options?: {
    onError?:
      | ((
          error: unknown,
          variables: void,
          context: unknown
        ) => Promise<unknown> | void)
      | undefined;
  };
};

export const useRobloxBackendLogin = ({
  loggedInData,
  sellerId,
  mutationKey,
  options
}: UseRobloxBackendLoginProps) => {
  const { mutateAsync: signTypedDataAsync } = useWeb3SignTypedData();
  const { mutateAsync: verifySignature } = usePostRobloxWalletAuth();
  const { address = "" } = useAccount();
  const disconnect = useDisconnect();
  return useMutation(
    mutationKey,
    async () => {
      if (!loggedInData?.claims) {
        throw new Error(
          `[useRobloxBackendLogin] loggedInData.claims is falsy (${loggedInData?.claims})`
        );
      }
      if (!loggedInData.nonce) {
        throw new Error(
          `[useRobloxBackendLogin] loggedInData.nonce is falsy (${loggedInData.nonce})`
        );
      }
      const { dataToSign } = prepareAuthSignature(
        loggedInData.claims,
        loggedInData.nonce,
        sellerId.toString()
      );

      const signature = await signTypedDataAsync({
        dataToSign: JSON.stringify(dataToSign)
      });
      return signature;
    },
    {
      ...options,
      retry: 3,
      retryDelay: 1000,
      onSettled: (data, error) => {
        if (data) {
          console.log("useSignTypedData success", data);
          verifySignature({ signature: data, sellerId, address });
        }
        if (error) {
          console.error("useSignTypedData error: " + error);
          // When all attempt have failed, force the wallet disconnection to avoid a dead end state of the app
          disconnect({ isUserDisconnecting: false });
        }
      }
    }
  );
};
