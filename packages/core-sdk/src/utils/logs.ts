import { Log } from "@bosonprotocol/common";
import { Interface } from "@ethersproject/abi";

export function getValueFromLogs(args: {
  iface: Interface;
  logs: Log[];
  eventArgsKey: string;
  eventName: string;
}): string | null {
  const relevantLogs = getValuesFromLogs(args);

  if (relevantLogs.length === 0) {
    return null;
  }

  return relevantLogs[0];
}

export function getValuesFromLogs(args: {
  iface: Interface;
  logs: Log[];
  eventArgsKey: string;
  eventName: string;
}): string[] {
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
  console.log(
    "🚀  roberto --  ~ file: logs.ts ~ line 37 ~ relevantLogs",
    relevantLogs
  );

  if (relevantLogs.length === 0) {
    return null;
  }

  return relevantLogs.map((relevantLog) =>
    String(relevantLog.args[args.eventArgsKey])
  );
}
