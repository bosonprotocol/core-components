import { useContext } from "react";
import { BlockNumberContext, MISSING_PROVIDER } from "./BlockNumberProvider";

function useBlockNumberContext() {
  const blockNumber = useContext(BlockNumberContext);
  if (blockNumber === MISSING_PROVIDER) {
    throw new Error(
      "BlockNumber hooks must be wrapped in a <BlockNumberProvider>"
    );
  }
  return blockNumber;
}

/** Requires that BlockUpdater be installed in the DOM tree. */
export function useBlockNumber(): number | undefined {
  return useBlockNumberContext().block;
}

export function useMainnetBlockNumber(): number | undefined {
  return useBlockNumberContext().mainnetBlock;
}
