import { utils, constants, Wallet } from "ethers";

import { CoreSDK } from "../../packages/core-sdk/src";

import {
  initCoreSDKWithFundedWallet,
  ensureCreatedSeller,
  waitForGraphNodeIndexing,
  createDisputeResolver,
  deployerWallet,
  seedWallet3
} from "./utils";

jest.setTimeout(60_000);

const protocolAdminWallet = deployerWallet; // be sure the seedWallet is not used by another test (to allow concurrent run)
const sellerWallet = seedWallet3; // be sure the seedWallet is not used by another test (to allow concurrent run)

describe("CoreSDK - accounts", () => {
  describe("dispute resolver", () => {
    const escalationResponsePeriodInMS = 60_000_000_000;
    // TODO: use valid metadata uri
    const metadataUri = "ipfs://dispute-resolver-uri";
    const ethDisputeResolutionFee = {
      tokenAddress: constants.AddressZero,
      tokenName: "Native",
      feeAmount: utils.parseEther("1")
    };

    beforeAll(async () => {});

    test("create", async () => {
      const disputeResolverAddress =
        Wallet.createRandom().address.toLowerCase();

      const { disputeResolver } = await createDisputeResolver(
        protocolAdminWallet,
        {
          operator: disputeResolverAddress,
          clerk: disputeResolverAddress,
          admin: disputeResolverAddress,
          treasury: disputeResolverAddress,
          metadataUri,
          escalationResponsePeriodInMS,
          fees: [],
          sellerAllowList: []
        }
      );

      expect(disputeResolver.active).toBeFalsy();
      expect(disputeResolver.admin).toBe(disputeResolverAddress);
      expect(disputeResolver.clerk).toBe(disputeResolverAddress);
      expect(disputeResolver.operator).toBe(disputeResolverAddress);
      expect(disputeResolver.treasury).toBe(disputeResolverAddress);
      expect(disputeResolver.metadataUri).toBe(metadataUri);
      expect(disputeResolver.sellerAllowList.length).toBe(0);
      expect(disputeResolver.fees.length).toBe(0);
      expect(disputeResolver.escalationResponsePeriod).toBe(
        (escalationResponsePeriodInMS / 1000).toString()
      );
    });

    test("activate", async () => {
      const disputeResolverAddress =
        Wallet.createRandom().address.toLowerCase();

      const { disputeResolver } = await createDisputeResolver(
        protocolAdminWallet,
        {
          operator: disputeResolverAddress,
          clerk: disputeResolverAddress,
          admin: disputeResolverAddress,
          treasury: disputeResolverAddress,
          metadataUri,
          escalationResponsePeriodInMS,
          fees: [],
          sellerAllowList: []
        },
        {
          activate: true
        }
      );

      expect(disputeResolver.active).toBeTruthy();
    });

    test("update", async () => {
      const { coreSDK, fundedWallet } = await initCoreSDKWithFundedWallet(
        protocolAdminWallet
      );
      const disputeResolverAddress = fundedWallet.address.toLowerCase();

      const { disputeResolver: disputeResolverBeforeUpdate } =
        await createDisputeResolver(
          protocolAdminWallet,
          {
            operator: disputeResolverAddress,
            clerk: disputeResolverAddress,
            admin: disputeResolverAddress,
            treasury: disputeResolverAddress,
            metadataUri,
            escalationResponsePeriodInMS,
            fees: [],
            sellerAllowList: []
          },
          {
            activate: true
          }
        );

      await (
        await coreSDK.updateDisputeResolver(disputeResolverBeforeUpdate.id, {
          metadataUri: "ipfs://changed",
          escalationResponsePeriodInMS: 123_000
        })
      ).wait();
      await waitForGraphNodeIndexing();

      const disputeResolverAfterUpdate = await coreSDK.getDisputeResolverById(
        disputeResolverBeforeUpdate.id
      );

      expect(disputeResolverAfterUpdate.metadataUri).toBe("ipfs://changed");
      expect(disputeResolverAfterUpdate.escalationResponsePeriod).toBe("123");
      expect(disputeResolverAfterUpdate.operator).toBe(
        disputeResolverBeforeUpdate.operator
      );
      expect(disputeResolverAfterUpdate.clerk).toBe(
        disputeResolverBeforeUpdate.clerk
      );
      expect(disputeResolverAfterUpdate.treasury).toBe(
        disputeResolverBeforeUpdate.treasury
      );
    });

    test("add fees", async () => {
      const { coreSDK, fundedWallet } = await initCoreSDKWithFundedWallet(
        protocolAdminWallet
      );
      const disputeResolverAddress = fundedWallet.address.toLowerCase();

      const { disputeResolver } = await createDisputeResolver(
        protocolAdminWallet,
        {
          operator: disputeResolverAddress,
          clerk: disputeResolverAddress,
          admin: disputeResolverAddress,
          treasury: disputeResolverAddress,
          metadataUri,
          escalationResponsePeriodInMS,
          fees: [],
          sellerAllowList: []
        },
        {
          activate: true
        }
      );

      await (
        await coreSDK.addFeesToDisputeResolver(disputeResolver.id, [
          ethDisputeResolutionFee
        ])
      ).wait();
      await waitForGraphNodeIndexing();

      const disputeResolverAfterUpdate = await coreSDK.getDisputeResolverById(
        disputeResolver.id
      );

      expect(disputeResolverAfterUpdate.fees[0].tokenAddress).toBe(
        ethDisputeResolutionFee.tokenAddress
      );
      expect(disputeResolverAfterUpdate.fees[0].tokenName).toBe(
        ethDisputeResolutionFee.tokenName
      );
      expect(disputeResolverAfterUpdate.fees[0].feeAmount).toBe(
        ethDisputeResolutionFee.feeAmount.toString()
      );
      expect(disputeResolverAfterUpdate.fees[0].token.decimals).toBe("18");
      expect(disputeResolverAfterUpdate.fees[0].token.symbol).toBe("ETH");
    });

    test("remove fees", async () => {
      const { coreSDK, fundedWallet } = await initCoreSDKWithFundedWallet(
        protocolAdminWallet
      );
      const disputeResolverAddress = fundedWallet.address.toLowerCase();

      const { disputeResolver: disputeResolverBeforeUpdate } =
        await createDisputeResolver(
          protocolAdminWallet,
          {
            operator: disputeResolverAddress,
            clerk: disputeResolverAddress,
            admin: disputeResolverAddress,
            treasury: disputeResolverAddress,
            metadataUri,
            escalationResponsePeriodInMS,
            fees: [ethDisputeResolutionFee],
            sellerAllowList: []
          },
          {
            activate: true
          }
        );

      await (
        await coreSDK.removeFeesFromDisputeResolver(
          disputeResolverBeforeUpdate.id,
          [ethDisputeResolutionFee.tokenAddress]
        )
      ).wait();
      await waitForGraphNodeIndexing();

      const disputeResolverAfterUpdate = await coreSDK.getDisputeResolverById(
        disputeResolverBeforeUpdate.id
      );

      expect(disputeResolverBeforeUpdate.fees.length).toBe(1);
      expect(disputeResolverAfterUpdate.fees.length).toBe(0);
    });

    test("add sellers", async () => {
      const [seller, { coreSDK, fundedWallet }] = await Promise.all([
        ensureCreatedSeller(sellerWallet),
        initCoreSDKWithFundedWallet(protocolAdminWallet)
      ]);
      const disputeResolverAddress = fundedWallet.address.toLowerCase();

      const { disputeResolver } = await createDisputeResolver(
        protocolAdminWallet,
        {
          operator: disputeResolverAddress,
          clerk: disputeResolverAddress,
          admin: disputeResolverAddress,
          treasury: disputeResolverAddress,
          metadataUri,
          escalationResponsePeriodInMS,
          fees: [],
          sellerAllowList: []
        },
        {
          activate: true
        }
      );

      await (
        await coreSDK.addSellersToDisputeResolverAllowList(disputeResolver.id, [
          seller.id
        ])
      ).wait();
      await waitForGraphNodeIndexing();

      const disputeResolverAfterUpdate = await coreSDK.getDisputeResolverById(
        disputeResolver.id
      );

      expect(disputeResolverAfterUpdate.sellerAllowList[0]).toBe(seller.id);
    });

    test("remove sellers", async () => {
      const [seller, { coreSDK, fundedWallet }] = await Promise.all([
        ensureCreatedSeller(sellerWallet),
        initCoreSDKWithFundedWallet(protocolAdminWallet)
      ]);
      const disputeResolverAddress = fundedWallet.address.toLowerCase();

      const { disputeResolver: disputeResolverBeforeUpdate } =
        await createDisputeResolver(
          protocolAdminWallet,
          {
            operator: disputeResolverAddress,
            clerk: disputeResolverAddress,
            admin: disputeResolverAddress,
            treasury: disputeResolverAddress,
            metadataUri,
            escalationResponsePeriodInMS,
            fees: [],
            sellerAllowList: [seller.id]
          },
          {
            activate: true
          }
        );

      await (
        await coreSDK.removeSellersFromDisputeResolverAllowList(
          disputeResolverBeforeUpdate.id,
          [seller.id]
        )
      ).wait();
      await waitForGraphNodeIndexing();

      const disputeResolverAfterUpdate = await coreSDK.getDisputeResolverById(
        disputeResolverBeforeUpdate.id
      );

      expect(disputeResolverBeforeUpdate.sellerAllowList.length).toBe(1);
      expect(disputeResolverAfterUpdate.sellerAllowList.length).toBe(0);
    });
  });
});
