import * as Sentry from "@sentry/browser";
import { utils } from "ethers";
import { useEffect, useState } from "react";
import { Offer } from "../../types/offer";
import { useCoreSDKWithContext } from "../core-sdk/useCoreSdkWithContext";
import { BosonSnapshotGate__factory } from "./BosonSnapshotGate/typechain";
import { useAccount, useSigner } from "../connection/connection";

interface Props {
  commitProxyAddress?: string | undefined;
  offer: Offer;
}

export default function useCheckTokenGatedOffer({
  commitProxyAddress,
  offer
}: Props) {
  const { id, condition } = offer;
  const signer = useSigner();
  const { address } = useAccount();
  const core = useCoreSDKWithContext();
  const [isConditionMet, setConditionMet] = useState<boolean>(false);

  useEffect(() => {
    if (!address || !condition) {
      return;
    }
    (async () => {
      if (commitProxyAddress) {
        if (!signer) {
          return;
        }

        try {
          const proxyContract = BosonSnapshotGate__factory.connect(
            commitProxyAddress,
            signer
          );
          const [owned, used] = await proxyContract.checkSnapshot(
            condition.minTokenId,
            utils.getAddress(address)
          );
          setConditionMet(owned.sub(used).gt("0"));
        } catch (error) {
          console.error(error);
          setConditionMet(false);
          Sentry.captureException(error, {
            extra: {
              ...condition,
              commitProxyAddress,
              action: "checkSnapshot",
              location: "TokenGated"
            }
          });
        }
        return;
      }

      try {
        const met = await core.checkTokenGatedCondition(id, address);
        setConditionMet(met);
      } catch (error) {
        console.error(error);
        setConditionMet(false);
        Sentry.captureException(error, {
          extra: {
            ...condition,
            action: "checkTokenGatedCondition",
            location: "TokenGated"
          }
        });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [condition, address, commitProxyAddress]);
  return {
    isConditionMet
  };
}
