import { providers, Wallet, utils } from "ethers";
import { CoreSDK, getDefaultConfig } from "../../packages/core-sdk/src";
import { IpfsMetadataStorage } from "../../packages/ipfs-storage/src";
import { mockCreateOfferArgs } from "../../packages/common/tests/mocks";
import { EthersAdapter } from "../../packages/ethers-sdk/src";
import { ACCOUNT_1, ACCOUNT_2 } from "../../contracts/accounts";

jest.setTimeout(60_000);

const defaultConfig = getDefaultConfig({
  envName: "local"
});

const provider = new providers.JsonRpcProvider(defaultConfig.jsonRpcUrl);
const seedWallet1 = new Wallet(ACCOUNT_1.privateKey, provider);
const seedWallet2 = new Wallet(ACCOUNT_2.privateKey, provider);

const ipfsMetadataStorage = new IpfsMetadataStorage({
  url: defaultConfig.ipfsMetadataUrl
});
const graphMetadataStorage = new IpfsMetadataStorage({
  url: defaultConfig.theGraphIpfsUrl
});

describe("core-sdk", () => {
  describe("core user flows", () => {
    test("create seller + offer -> deposit seller funds -> commit", async () => {
      const metadata = {
        name: "name",
        description: "description",
        externalUrl: "external-url.com",
        schemaUrl: "schema-url.com"
      };
      const sellerFundsDepositInEth = "5";
      const [newSeller, buyer] = await Promise.all([
        createFundedWallet(seedWallet1),
        createFundedWallet(seedWallet2)
      ]);
      const sellerCoreSDK = CoreSDK.fromDefaultConfig({
        envName: "local",
        web3Lib: new EthersAdapter(provider, newSeller),
        metadataStorage: ipfsMetadataStorage,
        theGraphStorage: graphMetadataStorage
      });
      const buyerCoreSDK = CoreSDK.fromDefaultConfig({
        envName: "local",
        web3Lib: new EthersAdapter(provider, buyer),
        metadataStorage: ipfsMetadataStorage,
        theGraphStorage: graphMetadataStorage
      });

      /**
       * Step 1: Store metadata on ipfs
       */
      const metadataHash = await ipfsMetadataStorage.storeMetadata({
        ...metadata,
        type: "BASE"
      });
      const metadataUri = "ipfs://" + metadataHash;

      expect(typeof metadataHash).toBe("string");

      /**
       * Step 2-1: Create new seller account and offer
       */
      const createOfferTxResponse = await sellerCoreSDK.createSellerAndOffer(
        {
          operator: newSeller.address,
          admin: newSeller.address,
          clerk: newSeller.address,
          treasury: newSeller.address
        },
        mockCreateOfferArgs({
          offerChecksum: metadataHash,
          metadataUri
        })
      );
      const createOfferTxReceipt = await createOfferTxResponse.wait();
      const createdOfferId = sellerCoreSDK.getCreatedOfferIdFromLogs(
        createOfferTxReceipt.logs
      );

      expect(createdOfferId).toBeTruthy();

      /**
       * Step 2-2: Assert that subgraph indexed `Offer` and `Seller` entities
       */
      await waitForGraphNodeIndexing();
      const [offer, seller] = await Promise.all([
        sellerCoreSDK.getOfferById(createdOfferId || 0),
        sellerCoreSDK.getSellerByAddress(newSeller.address)
      ]);

      expect(offer).toBeTruthy();
      expect(offer.metadata).toMatchObject(metadata);
      expect(offer.metadataUri).toBe(metadataUri);
      expect(seller).toBeTruthy();
      expect(seller.operator.toLowerCase()).toBe(
        newSeller.address.toLowerCase()
      );

      /**
       * Step 3-1: Deposit seller funds
       */
      const depositFundsTxResponse = await sellerCoreSDK.depositFunds(
        offer.seller.id,
        utils.parseEther(sellerFundsDepositInEth)
      );
      const depositFundsTxReceipt = await depositFundsTxResponse.wait();

      expect(depositFundsTxReceipt.status).toBeTruthy();

      /**
       * Step 3-2: Assert that subgraph indexed `FundsEntity`
       */
      await waitForGraphNodeIndexing();

      const funds = await sellerCoreSDK.getFundsByAccountId(offer.seller.id);

      expect(funds.length).toBe(1);
      expect(funds[0].availableAmount).toBe(
        utils.parseEther(sellerFundsDepositInEth).toString()
      );
      expect(funds[0].token.symbol.toUpperCase()).toBe("ETH");

      /**
       * Step 4-1: Commit to offer
       */
      const commitToOfferTxResponse = await buyerCoreSDK.commitToOffer(
        offer.id
      );
      const commitToOfferTxReceipt = await commitToOfferTxResponse.wait();
      const exchangeId = buyerCoreSDK.getCommittedExchangeIdFromLogs(
        commitToOfferTxReceipt.logs
      );

      expect(exchangeId).toBeTruthy();

      /**
       * Step 4-2: Assert that subgraph indexed `Exchange` entity
       */
      // TODO
    });
  });
});

async function waitForGraphNodeIndexing() {
  await wait(5_000);
}

async function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function createFundedWallet(
  fundingWallet: Wallet,
  fundAmountInEth = "10"
) {
  const fundedWallet = Wallet.createRandom({
    provider: fundingWallet.provider
  });
  const fundingTx = await fundingWallet.sendTransaction({
    value: utils.parseEther(fundAmountInEth),
    to: fundedWallet.address
  });
  fundingTx.wait();

  return fundedWallet;
}
