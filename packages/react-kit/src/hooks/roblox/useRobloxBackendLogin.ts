import { formatBytes32String } from "ethers/lib/utils";
import { useWeb3SignTypedData } from "../connection/connection";
import { GetLoggedInResponse } from "@bosonprotocol/roblox-sdk";
import { useMutation } from "react-query";
import { usePostRobloxWalletAuth } from "./usePostRobloxWalletAuth";
import { mutationKeys } from "./mutationKeys";

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
  mutationKey: ReturnType<(typeof mutationKeys)["postWalletAuth"]>;
  address: string;
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
  options,
  address
}: UseRobloxBackendLoginProps) => {
  const { mutateAsync: signTypedDataAsync } = useWeb3SignTypedData();
  const { mutateAsync: verifySignature } = usePostRobloxWalletAuth();
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
        dataToSign: JSON.stringify(dataToSign),
        address
      });
      return signature;
    },
    {
      ...options,
      retry: 0,
      onSettled: (data) => {
        if (data) {
          console.log("useSignTypedData success", data);
          verifySignature({ signature: data, sellerId, address });
        }
      }
    }
  );
};
