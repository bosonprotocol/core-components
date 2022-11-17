import { ZERO_ADDRESS } from "./../../packages/core-sdk/tests/mocks";
import { Wallet, BigNumber } from "ethers";
import {
  MSEC_PER_DAY,
  MSEC_PER_SEC
} from "./../../packages/common/src/utils/timestamp";
import { utils, constants } from "ethers";

import {
  initCoreSDKWithFundedWallet,
  ensureCreatedSeller,
  waitForGraphNodeIndexing,
  createDisputeResolver,
  deployerWallet,
  seedWallet3,
  createFundedWallet,
  createSeller,
  updateSeller,
  mintLensToken
} from "./utils";
import { AuthTokenType } from "@bosonprotocol/common";

jest.setTimeout(60_000);

const protocolAdminWallet = deployerWallet; // be sure the seedWallet is not used by another test (to allow concurrent run)
const sellerWallet = seedWallet3; // be sure the seedWallet is not used by another test (to allow concurrent run)

describe("CoreSDK - accounts", () => {
  describe("dispute resolver", () => {
    const escalationResponsePeriodInMS = 90 * MSEC_PER_DAY - 1 * MSEC_PER_SEC;
    // TODO: use valid metadata uri
    const metadataUri = "ipfs://dispute-resolver-uri";
    const ethDisputeResolutionFee = {
      tokenAddress: constants.AddressZero,
      tokenName: "Native",
      feeAmount: utils.parseEther("1")
    };

    test("create", async () => {
      const fundedWallet = await createFundedWallet(protocolAdminWallet);
      const disputeResolverAddress = fundedWallet.address.toLowerCase();

      const { disputeResolver } = await createDisputeResolver(
        fundedWallet,
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
      const fundedWallet = await createFundedWallet(protocolAdminWallet);
      const disputeResolverAddress = fundedWallet.address.toLowerCase();

      const { disputeResolver } = await createDisputeResolver(
        fundedWallet,
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
          fundedWallet,
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

      const { coreSDK: coreSDK2, fundedWallet: randomWallet } =
        await initCoreSDKWithFundedWallet(seedWallet3);
      await (
        await coreSDK.updateDisputeResolver(disputeResolverBeforeUpdate.id, {
          operator: randomWallet.address,
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

      // check the pending updates lists the operator address
      expect(disputeResolverAfterUpdate.pendingDisputeResolver).toBeTruthy();
      expect(
        disputeResolverAfterUpdate.pendingDisputeResolver?.operator
      ).toEqual(randomWallet.address.toLowerCase());

      const txOptIn = await coreSDK2.optInToDisputeResolverUpdate({
        id: disputeResolverBeforeUpdate.id,
        fieldsToUpdate: {
          operator: true
        }
      });
      await txOptIn.wait();
      await waitForGraphNodeIndexing();
      const disputeResolverAfterOptIn = await coreSDK.getDisputeResolverById(
        disputeResolverBeforeUpdate.id
      );
      expect(disputeResolverAfterOptIn.operator).toBe(
        randomWallet.address.toLowerCase()
      );
      expect(
        disputeResolverAfterOptIn.pendingDisputeResolver?.operator
      ).toEqual(ZERO_ADDRESS);
    });

    test("add fees", async () => {
      const { coreSDK, fundedWallet } = await initCoreSDKWithFundedWallet(
        protocolAdminWallet
      );
      const disputeResolverAddress = fundedWallet.address.toLowerCase();

      const { disputeResolver } = await createDisputeResolver(
        fundedWallet,
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
          fundedWallet,
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
      const [sellers, { coreSDK, fundedWallet }] = await Promise.all([
        ensureCreatedSeller(sellerWallet),
        initCoreSDKWithFundedWallet(protocolAdminWallet)
      ]);
      const [seller] = sellers;
      const disputeResolverAddress = fundedWallet.address.toLowerCase();

      const { disputeResolver } = await createDisputeResolver(
        fundedWallet,
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
      const [sellers, { coreSDK, fundedWallet }] = await Promise.all([
        ensureCreatedSeller(sellerWallet),
        initCoreSDKWithFundedWallet(protocolAdminWallet)
      ]);
      const [seller] = sellers;
      const disputeResolverAddress = fundedWallet.address.toLowerCase();

      const { disputeResolver: disputeResolverBeforeUpdate } =
        await createDisputeResolver(
          fundedWallet,
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

  describe("seller", () => {
    test("create seller", async () => {
      const { coreSDK, fundedWallet } = await initCoreSDKWithFundedWallet(
        seedWallet3
      );

      const seller = await createSeller(coreSDK, fundedWallet.address);
      expect(seller).toBeTruthy();
      expect(seller.operator).toEqual(fundedWallet.address.toLowerCase());
      expect(seller.clerk).toEqual(fundedWallet.address.toLowerCase());
      expect(seller.admin).toEqual(fundedWallet.address.toLowerCase());
      expect(seller.treasury).toEqual(fundedWallet.address.toLowerCase());
      expect(BigNumber.from(seller.authTokenId).eq(0)).toBe(true);
      expect(seller.authTokenType).toEqual(AuthTokenType.NONE);
    });
    test("update seller - replace all addresses", async () => {
      const { coreSDK, fundedWallet } = await initCoreSDKWithFundedWallet(
        seedWallet3
      );

      let seller = await createSeller(coreSDK, fundedWallet.address);
      expect(seller).toBeTruthy();

      const { coreSDK: coreSDK2, fundedWallet: randomWallet } =
        await initCoreSDKWithFundedWallet(seedWallet3);
      seller = await updateSeller(
        coreSDK,
        seller,
        {
          admin: randomWallet.address,
          operator: randomWallet.address,
          clerk: randomWallet.address,
          treasury: randomWallet.address
        },
        [
          {
            coreSDK: coreSDK2,
            fieldsToUpdate: {
              admin: true,
              operator: true,
              clerk: true
            }
          }
        ]
      );

      expect(seller).toBeTruthy();
      expect(seller.operator).toEqual(randomWallet.address.toLowerCase());
      expect(seller.clerk).toEqual(randomWallet.address.toLowerCase());
      expect(seller.admin).toEqual(randomWallet.address.toLowerCase());
      expect(seller.treasury).toEqual(randomWallet.address.toLowerCase());
      expect(BigNumber.from(seller.authTokenId).eq(0)).toBe(true);
      expect(seller.authTokenType).toEqual(AuthTokenType.NONE);
    });
    test("update seller - assign an auth token owned by the current account", async () => {
      const { coreSDK, fundedWallet } = await initCoreSDKWithFundedWallet(
        seedWallet3
      );

      const tokenType = AuthTokenType.LENS;
      const tokenId = await mintLensToken(fundedWallet, fundedWallet.address);

      let seller = await createSeller(coreSDK, fundedWallet.address);
      expect(seller).toBeTruthy();

      seller = await updateSeller(coreSDK, seller, {
        admin: ZERO_ADDRESS,
        authTokenType: tokenType,
        authTokenId: tokenId.toString()
      });

      expect(seller).toBeTruthy();
      expect(seller.operator).toEqual(fundedWallet.address.toLowerCase());
      expect(seller.clerk).toEqual(fundedWallet.address.toLowerCase());
      expect(seller.treasury).toEqual(fundedWallet.address.toLowerCase());
      expect(seller.admin).toEqual(ZERO_ADDRESS);
      expect(BigNumber.from(seller.authTokenId).eq(tokenId)).toBe(true);
      expect(seller.authTokenType).toEqual(tokenType);
    });
    test("update seller - assign an auth token and change operator/clerk addresses", async () => {
      const { coreSDK, fundedWallet } = await initCoreSDKWithFundedWallet(
        seedWallet3
      );

      const tokenType = AuthTokenType.LENS;
      const tokenId = await mintLensToken(fundedWallet, fundedWallet.address);

      let seller = await createSeller(coreSDK, fundedWallet.address);
      expect(seller).toBeTruthy();

      const { coreSDK: coreSDK2, fundedWallet: randomWallet } =
        await initCoreSDKWithFundedWallet(seedWallet3);
      seller = await updateSeller(
        coreSDK,
        seller,
        {
          admin: ZERO_ADDRESS,
          operator: randomWallet.address,
          clerk: randomWallet.address,
          authTokenType: tokenType,
          authTokenId: tokenId.toString()
        },
        [
          {
            coreSDK: coreSDK2,
            fieldsToUpdate: {
              operator: true,
              clerk: true
            }
          }
        ]
      );

      expect(seller).toBeTruthy();
      expect(seller.operator).toEqual(randomWallet.address.toLowerCase());
      expect(seller.clerk).toEqual(randomWallet.address.toLowerCase());
      expect(seller.treasury).toEqual(fundedWallet.address.toLowerCase());
      expect(seller.admin).toEqual(ZERO_ADDRESS);
      expect(BigNumber.from(seller.authTokenId).eq(tokenId)).toBe(true);
      expect(seller.authTokenType).toEqual(tokenType);
    });
    test("update seller - update with another operator address, then update back the operator to the admin address", async () => {
      const { coreSDK, fundedWallet } = await initCoreSDKWithFundedWallet(
        seedWallet3
      );

      let seller = await createSeller(coreSDK, fundedWallet.address);
      expect(seller).toBeTruthy();

      const { coreSDK: coreSDK2, fundedWallet: randomWallet } =
        await initCoreSDKWithFundedWallet(seedWallet3);
      seller = await updateSeller(coreSDK, seller, {
        operator: randomWallet.address
      });
      // check the pending updates lists the operator address
      expect(seller.pendingSeller).toBeTruthy();
      expect(seller.pendingSeller?.operator).toEqual(
        randomWallet.address.toLowerCase()
      );

      // Call the optIn method with coreSDK2
      const optInTx = await coreSDK2.optInToSellerUpdate({
        id: seller.id,
        fieldsToUpdate: {
          operator: true
        }
      });
      await optInTx.wait();
      await waitForGraphNodeIndexing();
      seller = await coreSDK.getSellerById(seller.id as string);
      expect(seller).toBeTruthy();
      expect(seller.operator).toEqual(randomWallet.address.toLowerCase());
      expect(seller.pendingSeller?.operator).toEqual(ZERO_ADDRESS);

      seller = await updateSeller(coreSDK, seller, {
        operator: fundedWallet.address
      });

      expect(seller).toBeTruthy();
      expect(seller.operator).toEqual(fundedWallet.address.toLowerCase());
      expect(seller.pendingSeller?.operator).toEqual(ZERO_ADDRESS);
    });
  });
});
