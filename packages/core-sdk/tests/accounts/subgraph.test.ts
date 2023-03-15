import {
  getSellerByAddress,
  getSellerByAuthToken
} from "../../src/accounts/subgraph";
import { ADDRESS } from "@bosonprotocol/common/tests/mocks";
import {
  SUBGRAPH_URL,
  interceptSubgraph,
  mockRawSellerFromSubgraph
} from "../mocks";

describe("#getSellerByAddress()", () => {
  test("return falsy if address no seller", async () => {
    interceptSubgraph()
      .times(3)
      .reply(200, {
        data: {
          sellers: []
        }
      });

    const rawSeller = await getSellerByAddress(SUBGRAPH_URL, ADDRESS);

    expect(rawSeller).toBeFalsy();
  });

  test("return undefined if address is treasury", async () => {
    const mockedRawSellerFromSubgraph = mockRawSellerFromSubgraph({
      treasury: ADDRESS
    });
    interceptSubgraph()
      .times(3)
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
      .times(1)
      .reply(200, {
        data: {
          sellers: [mockedRawSellerFromSubgraph]
        }
      });
    interceptSubgraph()
      .times(1)
      .reply(200, {
        data: {
          sellers: []
        }
      });
    interceptSubgraph()
      .times(1)
      .reply(200, {
        data: {
          sellers: []
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
      .times(1)
      .reply(200, {
        data: {
          sellers: []
        }
      });
    interceptSubgraph()
      .times(1)
      .reply(200, {
        data: {
          sellers: [mockedRawSellerFromSubgraph]
        }
      });
    interceptSubgraph()
      .times(1)
      .reply(200, {
        data: {
          sellers: []
        }
      });

    const rawSeller = await getSellerByAddress(SUBGRAPH_URL, ADDRESS);

    expect(rawSeller).toMatchObject(mockedRawSellerFromSubgraph);
  });

  test("return seller if address is clerk", async () => {
    const mockedRawSellerFromSubgraph = mockRawSellerFromSubgraph({
      clerk: ADDRESS
    });
    interceptSubgraph()
      .times(1)
      .reply(200, {
        data: {
          sellers: []
        }
      });
    interceptSubgraph()
      .times(1)
      .reply(200, {
        data: {
          sellers: []
        }
      });
    interceptSubgraph()
      .times(1)
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
      admin: ADDRESS,
      clerk: ADDRESS,
      assistant: ADDRESS,
      treasury: ADDRESS,
      authTokenId: tokenId,
      authTokenType: 1
    });
    interceptSubgraph()
      .times(5)
      .reply(200, {
        data: {
          sellers: [mockedRawSellerFromSubgraph]
        }
      });

    const rawSeller = await getSellerByAuthToken(SUBGRAPH_URL, tokenId, 1);

    expect(rawSeller).toMatchObject(mockedRawSellerFromSubgraph);
  });
});
