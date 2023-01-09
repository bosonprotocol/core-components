import { BigNumber } from "ethers";
import {
  seedWallet12,
  initCoreSDKWithWallet,
  MOCK_ERC20_ADDRESS
} from "./utils";

const seedWallet = seedWallet12; // be sure the seedWallet is not used by another test (to allow concurrent run)
// seedWallet9 is used to relay meta-transactions

const coreSDK = initCoreSDKWithWallet(seedWallet);

jest.setTimeout(60_000);

describe("native-meta-tx", () => {
  test("approve ERC20 token", async () => {
    const allowanceBefore = await coreSDK.getProtocolAllowance(
      MOCK_ERC20_ADDRESS
    );

    const newAllowance = BigNumber.from(allowanceBefore).add("100");

    const { r, s, v, functionSignature } =
      await coreSDK.signNativeMetaTxApproveExchangeToken(
        MOCK_ERC20_ADDRESS,
        newAllowance
      );

    // `Relayer` executes meta tx on behalf of seller
    const metaTx = await coreSDK.relayNativeMetaTransaction(
      MOCK_ERC20_ADDRESS,
      {
        functionSignature,
        sigR: r,
        sigS: s,
        sigV: v
      }
    );

    const metaTxReceipt = await metaTx.wait(2);
    expect(metaTxReceipt.transactionHash).toBeTruthy();
    expect(BigNumber.from(metaTxReceipt.effectiveGasPrice).gt(0)).toBe(true);

    const allowanceAfter = await coreSDK.getProtocolAllowance(
      MOCK_ERC20_ADDRESS
    );

    expect(BigNumber.from(allowanceAfter).eq(newAllowance)).toBe(true);
  });
});
