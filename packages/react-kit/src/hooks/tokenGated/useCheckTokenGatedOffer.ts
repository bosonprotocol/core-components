import * as Sentry from "@sentry/browser";
import { utils } from "ethers";
import { useEffect, useState } from "react";
import { useAccount } from "hooks/connection/connection";
import { Offer } from "../../types/offer";
import { useCoreSDKWithContext } from "../useCoreSdkWithContext";
import { BosonSnapshotGate__factory } from "./BosonSnapshotGate/typechain";
import { useEthersSigner } from "../ethers/useEthersSigner";

interface Props {
  commitProxyAddress?: string | undefined;
  condition?: Offer["condition"] | undefined;
}

export default function useCheckTokenGatedOffer({
  commitProxyAddress,
  condition
}: Props) {
  const signer = useEthersSigner();
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
        const met = await core.checkTokenGatedCondition(condition, address);
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
