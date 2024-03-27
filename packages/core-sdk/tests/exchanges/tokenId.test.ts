import { BigNumberish, BigNumber } from "@ethersproject/bignumber";
import { MockWeb3LibAdapter } from "@bosonprotocol/common/tests/mocks";
import { CoreSDK, getEnvConfigs } from "../../src";
import { SUBGRAPH_URL } from "../mocks";

describe("tokenId to exchangeId", () => {
  const defaultConfig = getEnvConfigs("testing")[0];
  const coreSDK = new CoreSDK({
    web3Lib: new MockWeb3LibAdapter(),
    subgraphUrl: SUBGRAPH_URL,
    protocolDiamond: defaultConfig.contracts.protocolDiamond,
    chainId: defaultConfig.chainId
  });
  const shiftOfferId = (offerId: BigNumberish): BigNumber =>
    BigNumber.from(offerId).mul(BigNumber.from(2).pow(128));
  const LIST: {
    offerId: BigNumberish;
    exchangeId: BigNumberish;
    tokenId: BigNumberish;
  }[] = [
    {
      offerId: 0,
      exchangeId: 0,
      tokenId: 0
    },
    {
      offerId: "0",
      exchangeId: "0",
      tokenId: "0"
    },
    {
      offerId: 1,
      exchangeId: 1,
      tokenId: shiftOfferId(1).add(1)
    },
    {
      offerId: "1",
      exchangeId: "1",
      tokenId: shiftOfferId(1).add(1).toString()
    },
    {
      offerId: 10,
      exchangeId: 20,
      tokenId: shiftOfferId(10).add(20)
    },
    {
      offerId: 20,
      exchangeId: 10,
      tokenId: shiftOfferId(20).add(10)
    },
    {
      offerId: "730",
      exchangeId: "394",
      tokenId: "248406127852285078328263463425190794363274"
    }
  ];

  describe("exchangeId + offerId => tokenId", () => {
    test.each(LIST)(
      `check tokenId %p`,
      async ({ offerId, exchangeId, tokenId }) => {
        const _tokenId = coreSDK.getExchangeTokenId(exchangeId, offerId);
        expect(_tokenId.toString()).toEqual(tokenId.toString());
      }
    );
  });
  describe("tokenId => exchangeId + offerId", () => {
    test.each(LIST)(
      `check {offerId, exchangeId} %p`,
      async ({ offerId, exchangeId, tokenId }) => {
        const { offerId: _offerId, exchangeId: _exchangeId } =
          coreSDK.parseTokenId(tokenId);
        expect(_offerId.toString()).toEqual(offerId.toString());
        expect(_exchangeId.toString()).toEqual(exchangeId.toString());
      }
    );
  });
});
