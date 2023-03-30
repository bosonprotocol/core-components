import dayjs from "dayjs";
import { useMemo } from "react";
import { useExchanges } from "./useExchanges";
import { useDisputes } from "./useDisputes";
import { useConfigContext } from "../components/config/ConfigContext";

interface Props {
  exchangeId: string;
  tense: "present" | "past";
}

const formatShortDate = (date: string, shortDateFormat: string) => {
  return date
    ? dayjs(new Date(Number(date) * 1000)).format(shortDateFormat)
    : "";
};

export default function useTransactionHistory({ exchangeId, tense }: Props) {
  const { shortDateFormat } = useConfigContext();
  const { data: exchanges = [] } = useExchanges({
    id: exchangeId,
    disputed: null
  });
  const { data: disputes = [] } = useDisputes({
    disputesFilter: {
      exchange: exchangeId
    }
  });
  const isPresent = tense === "present";
  const [dispute] = disputes;
  const [exchange] = exchanges;
  const timesteps = useMemo(() => {
    const { committedDate, redeemedDate, cancelledDate, revokedDate } =
      exchange;
    const timesteps: { text: string; date: string; timestamp: number }[] = [];
    if (committedDate) {
      timesteps.push({
        text: isPresent ? "Commit" : "Committed",
        date: formatShortDate(committedDate, shortDateFormat),
        timestamp: Number(committedDate)
      });
    }
    if (redeemedDate) {
      timesteps.push({
        text: isPresent ? "Redeem" : "Redeemed",
        date: formatShortDate(redeemedDate, shortDateFormat),
        timestamp: Number(redeemedDate)
      });
    }
    if (cancelledDate) {
      timesteps.push({
        text: isPresent ? "Cancel" : "Cancelled",
        date: formatShortDate(cancelledDate, shortDateFormat),
        timestamp: Number(cancelledDate)
      });
    }
    if (revokedDate) {
      timesteps.push({
        text: isPresent ? "Revoke" : "Revoked",
        date: formatShortDate(revokedDate, shortDateFormat),
        timestamp: Number(revokedDate)
      });
    }
    if (dispute) {
      const { disputedDate, retractedDate, resolvedDate } = dispute;
      if (disputedDate) {
        timesteps.push({
          text: isPresent ? "Raise Dispute" : "Dispute Raised",
          date: formatShortDate(disputedDate, shortDateFormat),
          timestamp: Number(disputedDate)
        });
      }
      if (retractedDate) {
        timesteps.push({
          text: isPresent ? "Retract Dispute" : "Dispute Retracted",
          date: formatShortDate(retractedDate, shortDateFormat),
          timestamp: Number(retractedDate)
        });
      }
      if (resolvedDate) {
        timesteps.push({
          text: isPresent ? "Mutual Resolution" : "Dispute Mutually Resolved",
          date: formatShortDate(resolvedDate, shortDateFormat),
          timestamp: Number(resolvedDate)
        });
      }
    }

    return timesteps.sort((a, b) => a.timestamp - b.timestamp);
  }, [exchange, dispute, isPresent, shortDateFormat]);
  return { timesteps };
}
