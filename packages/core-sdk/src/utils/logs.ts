import { Log } from "@bosonprotocol/common";
import { Interface } from "@ethersproject/abi";

export function getValueFromLogs(args: {
  iface: Interface;
  logs: Log[];
  eventArgsKey: string;
  eventName: string;
}) {
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

  const [relevantLog] = parsedLogs.filter((log) => log.name === args.eventName);

  if (!relevantLog) {
    return null;
  }

  return String(relevantLog.args[args.eventArgsKey]);
}
