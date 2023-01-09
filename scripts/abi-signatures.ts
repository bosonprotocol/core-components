import fs from "fs";
import { program } from "commander";
import { abis } from "@bosonprotocol/common";
import { Interface } from "@ethersproject/abi";

program
  .description("Reports all event/method signatures.")
  .option("-s, --search <PATTERN>", "Signature Pattern", "")
  .option("-csv, --csv <FILENAME>", "CSV export file", "")
  .parse(process.argv);

async function main() {
  const args = program.args;
  const opts = program.opts();

  console.log("Generate Abi Signatures", args, opts);

  console.log("Abis:", Object.keys(abis));
  if (opts.search && opts.search !== "") {
    console.log("Filter Signatures starting with", opts.search);
  }
  const signatures = {};
  Object.keys(abis).forEach((abi) => {
    const iface = new Interface(abis[abi]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let eventSigs: any = {};
    Object.keys(iface.events).forEach((event) => {
      const topic = iface.getEventTopic(event);
      if (
        !opts ||
        opts.search === "" ||
        topic.toLowerCase().startsWith(opts.search.toLowerCase())
      ) {
        eventSigs[event] = topic;
      }
    });
    if (Object.keys(eventSigs).length === 0) {
      eventSigs = undefined;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let funcSigs: any = {};
    Object.keys(iface.functions).forEach((func) => {
      const sigHash = iface.getSighash(func);
      if (
        !opts ||
        opts.search === "" ||
        sigHash.toLowerCase().startsWith(opts.search.toLowerCase())
      ) {
        funcSigs[func] = sigHash;
      }
    });
    if (Object.keys(funcSigs).length === 0) {
      funcSigs = undefined;
    }
    if (eventSigs || funcSigs) {
      signatures[abi] = {
        events: eventSigs,
        functions: funcSigs
      };
    }
  });
  if (opts.csv && opts.csv !== "") {
    const csvData = [["ABI", "TYPE", "SIGNATURE", "NAME"]];
    Object.keys(signatures).forEach((abiKey) => {
      const abi = signatures[abiKey];
      if (abi["events"]) {
        const events = abi["events"];
        Object.keys(events).forEach((event) => {
          csvData.push([abiKey, "event", events[event], event]);
        });
      }
      if (abi["functions"]) {
        const functions = abi["functions"];
        Object.keys(functions).forEach((func) => {
          csvData.push([abiKey, "function", functions[func], func]);
        });
      }
    });
    exportToCsv(csvData, opts.csv);
    console.log("Signatures have been exported into", opts.csv);
  } else {
    console.log("Signatures:", signatures);
  }
}

main()
  .then(() => {
    console.log("success");
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportToCsv(csvData: any[][], csvFile: string) {
  const csvStr = csvData
    .map((cols) => cols.map((col) => '"' + col + '"').join(","))
    .join("\n");
  fs.writeFileSync(csvFile, csvStr);
}
