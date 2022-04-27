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
