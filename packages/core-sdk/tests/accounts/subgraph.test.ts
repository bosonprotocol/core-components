import {
  getSellerByAddress,
  getSellerByAuthToken
} from "../../src/accounts/subgraph";
import { ADDRESS } from "@bosonprotocol/common/tests/mocks";
import {
  SUBGRAPH_URL,
  ZERO_ADDRESS,
  interceptSubgraph,
  mockRawSellerFromSubgraph
} from "../mocks";

describe("#getSellerByAddress()", () => {
  test("return falsy if address no seller", async () => {
    interceptSubgraph()
      .times(2)
      .reply(200, {
        data: {
          sellers: []
        }
      });

    const rawSeller = await getSellerByAddress(SUBGRAPH_URL, ADDRESS);

    expect(rawSeller).toBeFalsy();
  });

  test("return undefined if address is treasury", async () => {
    interceptSubgraph()
      .times(2)
      .reply(200, {
        data: {
          sellers: []
        }
      });

    const rawSeller = await getSellerByAddress(SUBGRAPH_URL, ADDRESS);

    expect(rawSeller).toBeUndefined();
  });

  test("return seller if address is assistant", async () => {
    const mockedRawSellerFromSubgraph = mockRawSellerFromSubgraph({
      assistant: ADDRESS
    });
    interceptSubgraph()
      .times(2)
      .reply(200, {
        data: {
          sellers: [mockedRawSellerFromSubgraph]
        }
      });

    const rawSeller = await getSellerByAddress(SUBGRAPH_URL, ADDRESS);

    expect(rawSeller).toMatchObject(mockedRawSellerFromSubgraph);
  });

  test("return seller if address is admin", async () => {
    const mockedRawSellerFromSubgraph = mockRawSellerFromSubgraph({
      admin: ADDRESS
    });
    interceptSubgraph()
      .times(2)
      .reply(200, {
        data: {
          sellers: [mockedRawSellerFromSubgraph]
        }
      });

    const rawSeller = await getSellerByAddress(SUBGRAPH_URL, ADDRESS);

    expect(rawSeller).toMatchObject(mockedRawSellerFromSubgraph);
  });

  test("return seller using auth token", async () => {
    const tokenId = "123456789";
    const mockedRawSellerFromSubgraph = mockRawSellerFromSubgraph({
      admin: ZERO_ADDRESS,
      clerk: ZERO_ADDRESS,
      assistant: ADDRESS,
      treasury: ADDRESS,
      authTokenId: tokenId,
      authTokenType: 1
    });
    interceptSubgraph()
      .times(1)
      .reply(200, {
        data: {
          sellers: [mockedRawSellerFromSubgraph]
        }
      });

    const rawSeller = await getSellerByAuthToken(SUBGRAPH_URL, tokenId, 1);

    expect(rawSeller).toMatchObject(mockedRawSellerFromSubgraph);
  });
});
