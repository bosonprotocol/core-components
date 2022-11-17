import { Log } from "@bosonprotocol/common";
import { Interface } from "@ethersproject/abi";

export function getValueFromLogs<T>(args: {
  iface: Interface;
  logs: Log[];
  eventArgsKey: string;
  eventName: string;
}): T | null {
  const relevantLogs = getValuesFromLogs<T>(args);

  if (!relevantLogs || relevantLogs.length === 0) {
    return null;
  }

  return relevantLogs[0] as T;
}

export function getValuesFromLogs<T>(args: {
  iface: Interface;
  logs: Log[];
  eventArgsKey: string;
  eventName: string;
}): T[] {
  const parsedLogs = args.logs
    .map((log) => {
      try {
        return args.iface.parseLog(log);
      } catch (error) {
        // assume that failing to parse is irrelevant log
        return null;
      }
    })
    .filter((log) => log !== null);

  const relevantLogs = parsedLogs.filter((log) => log.name === args.eventName);

  if (relevantLogs.length === 0) {
    return null;
  }

  return relevantLogs.map(
    (relevantLog) => relevantLog.args[args.eventArgsKey] as T
  );
}
