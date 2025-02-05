import { MockWeb3LibAdapter } from "@bosonprotocol/common/tests/mocks";
import { OpenSeaMarketplace } from "../../src/marketplaces/opensea";
import { MarketplaceType } from "../../src/marketplaces";
import {
  FulfillmentDataResponse,
  GetNFTResponse,
  NFT,
  OrderV2
} from "opensea-js";
import {
  AdvancedOrder,
  CreateInputItem,
  CreateOrderAction,
  OrderUseCase
} from "@opensea/seaport-js/lib/types";
import { ContractAddresses, Side } from "@bosonprotocol/common";
import { ItemType } from "@opensea/seaport-js/lib/constants";

let openSeaSdkHandlerReturn: Record<string, unknown>;
const mockOpenSeaSdkHandler = {
  api: {
    apiBaseUrl: "apiBaseUrl",
    getOrder: async (): Promise<OrderV2> => {
      return openSeaSdkHandlerReturn.getOrder as OrderV2;
    },
    getOrders: async (): Promise<{ orders: OrderV2[] }> => {
      return openSeaSdkHandlerReturn.getOrders as { orders: OrderV2[] };
    },
    generateFulfillmentData: async (): Promise<FulfillmentDataResponse> => {
      return openSeaSdkHandlerReturn.generateFulfillmentData as FulfillmentDataResponse;
    },
    getNFT: async (): Promise<GetNFTResponse> => {
      return openSeaSdkHandlerReturn.getNFT as GetNFTResponse;
    },
    postOrder: async (): Promise<OrderV2> => {
      return openSeaSdkHandlerReturn.postOrder as OrderV2;
    }
  },
  seaport_v1_6: {
    createOrder: async (): Promise<OrderUseCase<CreateOrderAction>> => {
      return openSeaSdkHandlerReturn.createOrder as OrderUseCase<CreateOrderAction>;
    }
  },
  createListing: async (): Promise<OrderV2> => {
    return openSeaSdkHandlerReturn.createListing as OrderV2;
  },
  getNFTItems: (): CreateInputItem[] => {
    return openSeaSdkHandlerReturn.getNFTItems as CreateInputItem[];
  },
  cancelOrder: async (args: {
    order: OrderV2;
    accountAddress: string;
    domain?: string;
  }): Promise<void> => {
    return;
  }
};

describe("", () => {
  let openseaSdkMarketplace: OpenSeaMarketplace;
  const asset = {
    contract: "contract",
    tokenId: "123"
  };
  beforeAll(async () => {
    const web3lib = new MockWeb3LibAdapter();
    openseaSdkMarketplace = new OpenSeaMarketplace(
      MarketplaceType.OPENSEA,
      mockOpenSeaSdkHandler,
      {} as unknown as ContractAddresses,
      "",
      web3lib
    );
  });
  test("createBidOrder() fails when the protocolAddress is not found", async () => {
    openSeaSdkHandlerReturn = {
      getNFT: {
        nft: {} as NFT
      },
      getNFTItems: [
        { itemType: ItemType.ERC721, token: "token", identifier: "123" }
      ],
      createOrder: {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        executeAllActions: () => {}
      }
    };
    await expect(
      openseaSdkMarketplace.createBidOrder({
        asset,
        offerer: "offerer",
        price: "100000",
        expirationTime: 0,
        exchangeToken: { address: "address", decimals: 18 },
        auction: true
      })
    ).rejects.toThrow(
      `Seaport protocol address must be specified in Listing or CoreSDK config`
    );
  });
  test("buildAdvancedOrder()", async () => {
    const order = {
      createdDate: Date.now().toString()
    } as OrderV2;
    const expectedAdvancedOrder = {
      signature: "signature"
    } as AdvancedOrder;
    openSeaSdkHandlerReturn = {
      getOrder: order,
      generateFulfillmentData: {
        fulfillment_data: {
          transaction: {
            input_data: {
              orders: [expectedAdvancedOrder]
            }
          }
        }
      }
    };
    const advancedOrder = await openseaSdkMarketplace.buildAdvancedOrder(asset);
    expect(advancedOrder.signature).toEqual(expectedAdvancedOrder.signature);
  });
  test("getOrder()", async () => {
    openSeaSdkHandlerReturn = {
      getOrder: null
    };
    const signedOrder = await openseaSdkMarketplace.getOrder(asset, Side.Ask);
    expect(signedOrder).not.toBeTruthy();
  });
  test("getOrders()", async () => {
    const order = {
      createdDate: Date.now().toString(),
      protocolData: {
        parameters: {
          consideration: [
            {
              itemType: ItemType.ERC721
            }
          ],
          offer: [
            {
              itemType: ItemType.ERC20,
              startAmount: "1"
            }
          ]
        },
        signature: "signature"
      }
    } as OrderV2;
    openSeaSdkHandlerReturn = {
      getOrders: { orders: [order] }
    };
    const signedOrders = await openseaSdkMarketplace.getOrders(
      {
        contract: asset.contract,
        tokenIds: [asset.tokenId]
      },
      Side.Ask
    );
    expect(signedOrders.length).toEqual(1);
  });
  test("getOrders() failed #1", async () => {
    const order = {
      createdDate: Date.now().toString(),
      protocolData: {
        parameters: {
          consideration: [
            {
              itemType: ItemType.ERC721
            }
          ],
          offer: [
            {
              itemType: ItemType.ERC721
            }
          ]
        },
        signature: "signature"
      }
    } as OrderV2;
    openSeaSdkHandlerReturn = {
      getOrders: { orders: [order] }
    };
    const signedOrders = await openseaSdkMarketplace.getOrders(
      {
        contract: asset.contract,
        tokenIds: [asset.tokenId]
      },
      Side.Ask
    );
    expect(signedOrders.length).toEqual(1);
  });
  test("getOrders() failed #2", async () => {
    const order = {
      createdDate: Date.now().toString(),
      protocolData: {
        parameters: {
          consideration: [
            {
              itemType: ItemType.ERC20,
              startAmount: "1"
            }
          ],
          offer: [
            {
              itemType: ItemType.ERC20,
              startAmount: "2"
            }
          ]
        },
        signature: "signature"
      }
    } as OrderV2;
    openSeaSdkHandlerReturn = {
      getOrders: { orders: [order] }
    };
    const signedOrders = await openseaSdkMarketplace.getOrders(
      {
        contract: asset.contract,
        tokenIds: [asset.tokenId]
      },
      Side.Ask
    );
    expect(signedOrders.length).toEqual(1);
  });
});
