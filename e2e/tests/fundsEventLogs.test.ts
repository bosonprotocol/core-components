import { EventType } from "../../packages/core-sdk/src/subgraph";
import {
  createSellerAndOffer,
  initCoreSDKWithFundedWallet,
  seedWallet13
} from "./utils";

jest.setTimeout(60_000);
const seedWallet = seedWallet13; // be sure the seedWallet is not used by another test (to allow concurrent run)

describe("fundsEventLogs", () => {
  test("Check funds encumbered", async () => {
    const { coreSDK, fundedWallet } =
      await initCoreSDKWithFundedWallet(seedWallet);

    const createdOffer = await createSellerAndOffer(
      coreSDK,
      fundedWallet.address,
      {
        sellerDeposit: 0
      }
    );
    let funds = await coreSDK.getFunds({
      fundsFilter: {
        account: createdOffer.seller.id,
        tokenAddress: createdOffer.exchangeToken.address
      }
    });
    expect(funds.length).toEqual(0);
    let eventLogs = await coreSDK.getEventLogs({
      logsFilter: {
        account: createdOffer.seller.id,
        type: EventType.FUNDS_ENCUMBERED
      }
    });
    expect(eventLogs.length).toEqual(0);
    const tx = await coreSDK.commitToOffer(createdOffer.id);
    await tx.wait();
    await coreSDK.waitForGraphNodeIndexing(tx);
    funds = await coreSDK.getFunds({
      fundsFilter: {
        account: createdOffer.seller.id,
        tokenAddress: createdOffer.exchangeToken.address
      }
    });
    expect(funds.length).toEqual(1);
    expect(funds[0].token.address).toEqual(createdOffer.exchangeToken.address);
    eventLogs = await coreSDK.getEventLogs({
      logsFilter: {
        account: createdOffer.seller.id,
        type: EventType.FUNDS_ENCUMBERED
      }
    });
    expect(eventLogs.length).toEqual(1);
  });
});
