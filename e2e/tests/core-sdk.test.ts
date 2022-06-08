import { providers, Wallet } from "ethers";
import { CoreSDK, getDefaultConfig } from "../../packages/core-sdk/src";
import { mockCreateOfferArgs } from "../../packages/common/tests/mocks";
import { EthersAdapter } from "../../packages/ethers-sdk/src";
import { ACCOUNT_1 } from "../../contracts/accounts";

jest.setTimeout(60_000);

describe("core-sdk", () => {
  test("rudimentary test", async () => {
    const defaultConfig = getDefaultConfig({
      envName: "local"
    });
    const provider = new providers.JsonRpcProvider(defaultConfig.jsonRpcUrl);
    const signer = new Wallet(ACCOUNT_1.privateKey, provider);
    const coreSdk = CoreSDK.fromDefaultConfig({
      envName: "local",
      web3Lib: new EthersAdapter(provider, signer)
    });

    const txResponse = await coreSdk.createSellerAndOffer(
      {
        operator: signer.address,
        admin: signer.address,
        clerk: signer.address,
        treasury: signer.address
      },
      mockCreateOfferArgs()
    );

    const txReceipt = await txResponse.wait();
    const createdOfferId = coreSdk.getCreatedOfferIdFromLogs(txReceipt.logs);

    await wait(15_000);

    const offer = await coreSdk.getOfferById(createdOfferId);
    console.log(offer);

    expect(offer).toBeTruthy();
  });
});

async function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
