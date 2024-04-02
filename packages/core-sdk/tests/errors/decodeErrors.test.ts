import { Interface } from "@ethersproject/abi";
import { MockWeb3LibAdapter } from "@bosonprotocol/common/tests/mocks";
import { CoreSDK, abis } from "../../src";
import { ErrorFragment } from "@bosonprotocol/common/src";

const errorsMap = new Map<string, ErrorFragment>();
const errorHashes: string[] = [];

function parseErrors() {
  Object.keys(abis).forEach((abi) => {
    const iface = new Interface(abis[abi]);
    Object.keys(iface.errors).forEach((error) => {
      const sigHash = iface.getSighash(error);
      if (!errorsMap.has(sigHash)) {
        errorHashes.push(sigHash);
        errorsMap.set(sigHash, iface.errors[error] as ErrorFragment);
      }
    });
  });
}

parseErrors();

let coreSDK: CoreSDK;

beforeEach(() => {
  coreSDK = CoreSDK.fromDefaultConfig({
    web3Lib: new MockWeb3LibAdapter(),
    envName: "testing",
    configId: "testing-80001-0"
  });
  expect(coreSDK).toBeInstanceOf(CoreSDK);
});

test.each(errorHashes)("decode error %p", (errorHash) => {
  const random = Math.floor(Math.random() * 4); // random integer between 0 and 3
  const error = buildError(errorHash, random);
  const fragment = errorsMap.get(errorHash);
  expect(fragment).toBeTruthy();
  const decodedError = coreSDK.parseError(error);
  expect(decodedError["decoded"]).toBeTruthy();
  expect(decodedError["decoded"]).toEqual(fragment?.name);
});

test("decode unknown error code", () => {
  const random = Math.floor(Math.random() * 4); // random integer between 0 and 3
  const unknownErrorHash = "0xabcdef01";
  const found = Array.from(errorsMap.keys()).some(
    (hash) => hash.toLowerCase() === unknownErrorHash.toLowerCase()
  );
  // be sure the error hash does not exist
  expect(found).toBe(false);
  const error = buildError(unknownErrorHash, random);
  const decodedError = coreSDK.parseError(error);
  expect(decodedError["decoded"]).toBeFalsy();
});

test("decode no error code", () => {
  const error = { dummy: "dummy", error: { dummy: "dummy" } };
  const decodedError = coreSDK.parseError(error);
  expect(decodedError["decoded"]).toBeFalsy();
});

function buildError(errorHash: string, depth = 0): object {
  if (depth > 0) {
    return {
      dummy: "dummy",
      error: buildError(errorHash, depth - 1)
    };
  }
  return {
    dummy: "dummy",
    data: errorHash
  };
}
