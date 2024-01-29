import { ZERO_ADDRESS } from "./../../packages/core-sdk/tests/mocks";
import { BigNumber } from "ethers";
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
  mintLensToken,
  sellerMetadata,
  getSellerMetadataUri
} from "./utils";
import { AuthTokenType } from "../../packages/common";

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
      feeAmount: utils.parseEther("0")
    };

    test("create", async () => {
      const fundedWallet = await createFundedWallet(protocolAdminWallet);
      const disputeResolverAddress = fundedWallet.address.toLowerCase();

      const { disputeResolver } = await createDisputeResolver(
        fundedWallet,
        protocolAdminWallet,
        {
          assistant: disputeResolverAddress,
          admin: disputeResolverAddress,
          treasury: disputeResolverAddress,
          metadataUri,
          escalationResponsePeriodInMS,
          fees: [],
          sellerAllowList: []
        }
      );

      expect(disputeResolver.active).toBeTruthy();
      expect(disputeResolver.admin).toBe(disputeResolverAddress);
      expect(disputeResolver.clerk).toBe(ZERO_ADDRESS);
      expect(disputeResolver.assistant).toBe(disputeResolverAddress);
      expect(disputeResolver.treasury).toBe(disputeResolverAddress);
      expect(disputeResolver.metadataUri).toBe(metadataUri);
      expect(disputeResolver.sellerAllowList.length).toBe(0);
      expect(disputeResolver.fees.length).toBe(0);
      expect(disputeResolver.escalationResponsePeriod).toBe(
        (escalationResponsePeriodInMS / 1000).toString()
      );
    });

    test("update", async () => {
      const { coreSDK, fundedWallet } = await initCoreSDKWithFundedWallet(
        protocolAdminWallet
      );
      const disputeResolverAddress = fundedWallet.address.toLowerCase();

      const { disputeResolver: disputeResolverBeforeUpdate } =
        await createDisputeResolver(fundedWallet, protocolAdminWallet, {
          assistant: disputeResolverAddress,
          admin: disputeResolverAddress,
          treasury: disputeResolverAddress,
          metadataUri,
          escalationResponsePeriodInMS,
          fees: [],
          sellerAllowList: []
        });

      const { coreSDK: coreSDK2, fundedWallet: randomWallet } =
        await initCoreSDKWithFundedWallet(seedWallet3);
      const receipt = await (
        await coreSDK.updateDisputeResolver(disputeResolverBeforeUpdate.id, {
          assistant: randomWallet.address,
          metadataUri: "ipfs://changed",
          escalationResponsePeriodInMS: 123_000
        })
      ).wait();
      await waitForGraphNodeIndexing(receipt);

      const disputeResolverAfterUpdate = await coreSDK.getDisputeResolverById(
        disputeResolverBeforeUpdate.id
      );

      expect(disputeResolverAfterUpdate.metadataUri).toBe("ipfs://changed");
      expect(disputeResolverAfterUpdate.escalationResponsePeriod).toBe("123");
      expect(disputeResolverAfterUpdate.assistant).toBe(
        disputeResolverBeforeUpdate.assistant
      );
      expect(disputeResolverAfterUpdate.clerk).toBe(
        disputeResolverBeforeUpdate.clerk
      );
      expect(disputeResolverAfterUpdate.treasury).toBe(
        disputeResolverBeforeUpdate.treasury
      );

      // check the pending updates lists the assistant address
      expect(disputeResolverAfterUpdate.pendingDisputeResolver).toBeTruthy();
      expect(
        disputeResolverAfterUpdate.pendingDisputeResolver?.assistant
      ).toEqual(randomWallet.address.toLowerCase());

      const txOptIn = await coreSDK2.optInToDisputeResolverUpdate({
        id: disputeResolverBeforeUpdate.id,
        fieldsToUpdate: {
          assistant: true
        }
      });
      await txOptIn.wait();
      await waitForGraphNodeIndexing(txOptIn);
      const disputeResolverAfterOptIn = await coreSDK.getDisputeResolverById(
        disputeResolverBeforeUpdate.id
      );
      expect(disputeResolverAfterOptIn.assistant).toBe(
        randomWallet.address.toLowerCase()
      );
      expect(
        disputeResolverAfterOptIn.pendingDisputeResolver?.assistant
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
          assistant: disputeResolverAddress,
          admin: disputeResolverAddress,
          treasury: disputeResolverAddress,
          metadataUri,
          escalationResponsePeriodInMS,
          fees: [ethDisputeResolutionFee],
          sellerAllowList: []
        }
      );
      const secondFee = {
        tokenAddress: "0x0000000000000000000000000000000000000001",
        tokenName: "Not-Native",
        feeAmount: utils.parseEther("0")
      };
      const receipt = await (
        await coreSDK.addFeesToDisputeResolver(disputeResolver.id, [secondFee])
      ).wait();
      await waitForGraphNodeIndexing(receipt);

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

      expect(disputeResolverAfterUpdate.fees[1].tokenAddress).toBe(
        secondFee.tokenAddress
      );
      expect(disputeResolverAfterUpdate.fees[1].tokenName).toBe(
        secondFee.tokenName
      );
      expect(disputeResolverAfterUpdate.fees[1].feeAmount).toBe(
        secondFee.feeAmount.toString()
      );
      expect(disputeResolverAfterUpdate.fees[1].token.decimals).toBe("0");
      expect(disputeResolverAfterUpdate.fees[1].token.symbol).toBe("unknown");
    });

    test("remove fees", async () => {
      const { coreSDK, fundedWallet } = await initCoreSDKWithFundedWallet(
        protocolAdminWallet
      );
      const disputeResolverAddress = fundedWallet.address.toLowerCase();

      const { disputeResolver: disputeResolverBeforeUpdate } =
        await createDisputeResolver(fundedWallet, protocolAdminWallet, {
          assistant: disputeResolverAddress,
          admin: disputeResolverAddress,
          treasury: disputeResolverAddress,
          metadataUri,
          escalationResponsePeriodInMS,
          fees: [ethDisputeResolutionFee],
          sellerAllowList: []
        });

      const receipt = await (
        await coreSDK.removeFeesFromDisputeResolver(
          disputeResolverBeforeUpdate.id,
          [ethDisputeResolutionFee.tokenAddress]
        )
      ).wait();
      await waitForGraphNodeIndexing(receipt);

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
          assistant: disputeResolverAddress,
          admin: disputeResolverAddress,
          treasury: disputeResolverAddress,
          metadataUri,
          escalationResponsePeriodInMS,
          fees: [],
          sellerAllowList: []
        }
      );

      const receipt = await (
        await coreSDK.addSellersToDisputeResolverAllowList(disputeResolver.id, [
          seller.id
        ])
      ).wait();
      await waitForGraphNodeIndexing(receipt);

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
        await createDisputeResolver(fundedWallet, protocolAdminWallet, {
          assistant: disputeResolverAddress,
          admin: disputeResolverAddress,
          treasury: disputeResolverAddress,
          metadataUri,
          escalationResponsePeriodInMS,
          fees: [],
          sellerAllowList: [seller.id]
        });

      const receipt = await (
        await coreSDK.removeSellersFromDisputeResolverAllowList(
          disputeResolverBeforeUpdate.id,
          [seller.id]
        )
      ).wait();
      await waitForGraphNodeIndexing(receipt);

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
      expect(seller.assistant).toEqual(fundedWallet.address.toLowerCase());
      expect(seller.clerk).toEqual(ZERO_ADDRESS);
      expect(seller.admin).toEqual(fundedWallet.address.toLowerCase());
      expect(seller.treasury).toEqual(fundedWallet.address.toLowerCase());
      expect(BigNumber.from(seller.authTokenId).eq(0)).toBe(true);
      expect(seller.authTokenType).toEqual(AuthTokenType.NONE);
      expect(seller.metadata).toMatchObject(sellerMetadata);
    });
    test("create seller and then update metadata", async () => {
      const { coreSDK, fundedWallet } = await initCoreSDKWithFundedWallet(
        seedWallet3
      );

      const seller = await createSeller(coreSDK, fundedWallet.address);
      expect(seller).toBeTruthy();
      expect(seller.metadata).toMatchObject(sellerMetadata);
      const newMetadata = {
        type: "SELLER" as const,
        kind: "regular",
        contactPreference: "xmtp_and_email"
      };
      const metadataHash = await coreSDK.storeMetadata(newMetadata);
      const metadataUri = "ipfs://" + metadataHash;
      const updatedSeller = await updateSeller(coreSDK, seller, {
        metadataUri
      });
      expect(updatedSeller.metadata).toMatchObject(newMetadata);
    });
    test("create seller and then update salesChannels in metadata", async () => {
      const { coreSDK, fundedWallet } = await initCoreSDKWithFundedWallet(
        seedWallet3
      );

      const seller = await createSeller(coreSDK, fundedWallet.address);
      expect(seller).toBeTruthy();
      expect(seller.metadata).toMatchObject(sellerMetadata);
      const newMetadata = {
        type: "SELLER" as const,
        kind: "regular",
        contactPreference: "xmtp_and_email",
        salesChannels: [
          {
            tag: "CustomStoreFront",
            name: "my amazing store",
            deployments: [
              {
                link: "https://custom1",
                lastUpdated: "1686133617000"
              },
              {
                link: "https://custom2",
                lastUpdated: "1686133618000"
              }
            ]
          },
          {
            tag: "DCL"
          }
        ]
      };
      const metadataHash = await coreSDK.storeMetadata(newMetadata);
      const metadataUri = "ipfs://" + metadataHash;
      const updatedSeller = await updateSeller(coreSDK, seller, {
        metadataUri
      });
      expect(updatedSeller.metadata).toMatchObject(newMetadata);
    });

    test("create seller - expect fail as image url is too large", async () => {
      const { coreSDK, fundedWallet } = await initCoreSDKWithFundedWallet(
        seedWallet3
      );

      await expect(
        createSeller(coreSDK, fundedWallet.address, {
          sellerMetadata: {
            images: [
              {
                url: new Array(10000).join(","),
                tag: "tag",
                type: "IMAGE" as const,
                width: 505,
                height: 393
              }
            ]
          }
        })
      ).rejects.toThrowError(
        "Key images.0.url of metadata exceeds 2048 characters"
      );
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
          assistant: randomWallet.address,
          treasury: randomWallet.address
        },
        [
          {
            coreSDK: coreSDK2,
            fieldsToUpdate: {
              admin: true,
              assistant: true
            }
          }
        ]
      );

      expect(seller).toBeTruthy();
      expect(seller.assistant).toEqual(randomWallet.address.toLowerCase());
      expect(seller.clerk).toEqual(ZERO_ADDRESS);
      expect(seller.admin).toEqual(randomWallet.address.toLowerCase());
      expect(seller.treasury).toEqual(randomWallet.address.toLowerCase());
      expect(BigNumber.from(seller.authTokenId).eq(0)).toBe(true);
      expect(seller.authTokenType).toEqual(AuthTokenType.NONE);
    });
    test("update seller - assign an auth token owned by the current account", async () => {
      const { coreSDK, fundedWallet } = await initCoreSDKWithFundedWallet(
        seedWallet3
      );

      let seller = await createSeller(coreSDK, fundedWallet.address);
      expect(seller).toBeTruthy();

      const tokenType = AuthTokenType.LENS;
      const tokenId = await mintLensToken(fundedWallet, fundedWallet.address);

      seller = await updateSeller(coreSDK, seller, {
        admin: ZERO_ADDRESS,
        authTokenType: tokenType,
        authTokenId: tokenId.toString()
      });

      expect(seller).toBeTruthy();
      expect(seller.assistant).toEqual(fundedWallet.address.toLowerCase());
      expect(seller.clerk).toEqual(ZERO_ADDRESS);
      expect(seller.treasury).toEqual(fundedWallet.address.toLowerCase());
      expect(seller.admin).toEqual(ZERO_ADDRESS);
      expect(BigNumber.from(seller.authTokenId).eq(tokenId)).toBe(true);
      expect(seller.authTokenType).toEqual(tokenType);
    });
    test("update seller - assign an auth token and change assistant/clerk addresses", async () => {
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
          assistant: randomWallet.address,
          authTokenType: tokenType,
          authTokenId: tokenId.toString()
        },
        [
          {
            coreSDK: coreSDK2,
            fieldsToUpdate: {
              assistant: true
            }
          }
        ]
      );

      expect(seller).toBeTruthy();
      expect(seller.assistant).toEqual(randomWallet.address.toLowerCase());
      expect(seller.clerk).toEqual(ZERO_ADDRESS);
      expect(seller.treasury).toEqual(fundedWallet.address.toLowerCase());
      expect(seller.admin).toEqual(ZERO_ADDRESS);
      expect(BigNumber.from(seller.authTokenId).eq(tokenId)).toBe(true);
      expect(seller.authTokenType).toEqual(tokenType);
    });
    test("update seller - update with another assistant address, then update back the assistant to the admin address", async () => {
      const { coreSDK, fundedWallet } = await initCoreSDKWithFundedWallet(
        seedWallet3
      );

      let seller = await createSeller(coreSDK, fundedWallet.address);
      expect(seller).toBeTruthy();

      const { coreSDK: coreSDK2, fundedWallet: randomWallet } =
        await initCoreSDKWithFundedWallet(seedWallet3);
      seller = await updateSeller(coreSDK, seller, {
        assistant: randomWallet.address
      });
      // check the pending updates lists the assistant address
      expect(seller.pendingSeller).toBeTruthy();
      expect(seller.pendingSeller?.assistant).toEqual(
        randomWallet.address.toLowerCase()
      );

      // Call the optIn method with coreSDK2
      const optInTx = await coreSDK2.optInToSellerUpdate({
        id: seller.id,
        fieldsToUpdate: {
          assistant: true
        }
      });
      await optInTx.wait();
      await waitForGraphNodeIndexing(optInTx);
      seller = await coreSDK.getSellerById(seller.id as string);
      expect(seller).toBeTruthy();
      expect(seller.assistant).toEqual(randomWallet.address.toLowerCase());
      expect(seller.pendingSeller?.assistant).toEqual(ZERO_ADDRESS);

      seller = await updateSeller(coreSDK, seller, {
        assistant: fundedWallet.address
      });

      expect(seller).toBeTruthy();
      expect(seller.assistant).toEqual(fundedWallet.address.toLowerCase());
      expect(seller.pendingSeller?.assistant).toEqual(ZERO_ADDRESS);
    });
    test("update seller - update with another metadataUri", async () => {
      const { coreSDK, fundedWallet } = await initCoreSDKWithFundedWallet(
        seedWallet3
      );

      let seller = await createSeller(coreSDK, fundedWallet.address, {
        sellerMetadata: {
          description: sellerMetadata.description + "a"
        }
      });
      expect(seller).toBeTruthy();
      expect(seller.metadataUri).toBeTruthy();
      const updatedMetadataUri = await getSellerMetadataUri(coreSDK);

      seller = await updateSeller(coreSDK, seller, {
        metadataUri: updatedMetadataUri
      });
      expect(seller.metadataUri).toBe(updatedMetadataUri);
    });
    test("getSellers", async () => {
      const { coreSDK, fundedWallet } = await initCoreSDKWithFundedWallet(
        seedWallet3
      );
      const before = await coreSDK.getSellers();
      const seller = await createSeller(coreSDK, fundedWallet.address);
      expect(seller).toBeTruthy();
      let exist = before.some((s) => s.id === seller.id);
      expect(exist).toBe(false);
      const after = await coreSDK.getSellers();
      expect(after.length).toBeGreaterThan(before.length);
      exist = after.some((s) => s.id === seller.id);
      expect(exist).toBe(true);
    });
  });
});
