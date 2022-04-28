import { Log } from "@bosonprotocol/common";
import { Interface } from "@ethersproject/abi";

export function getCreatedOfferIdFromLogs(iface: Interface, logs: Log[]) {
  const parsedLogs = logs.map((log) => iface.parseLog(log));

  const [offerCreatedLog] = parsedLogs.filter(
    (log) => log.name === "OfferCreated"
  );

  if (!offerCreatedLog) {
    return null;
  }

  return String(offerCreatedLog.args.offerId);
}

export function getCommittedExchangeIdFromLogs(iface: Interface, logs: Log[]) {
  const parsedLogs = logs
    .map((log) => {
      try {
        return iface.parseLog(log);
      } catch (error) {
        // assume that failing to parse is irrelevant log
        return null;
      }
    })
    .filter((log) => log !== null);

  const [buyerCommittedLog] = parsedLogs.filter(
    (log) => log.name === "BuyerCommitted"
  );

  if (!buyerCommittedLog) {
    return null;
  }

  return String(buyerCommittedLog.args.exchangeId);
}
