import nock from "nock";
import { Biconomy } from "../../src/meta-tx/biconomy";
import { BICONOMY_URL } from "../mocks";

describe("Biconomy handler", () => {
  let biconomy: Biconomy;
  beforeAll(async () => {
    biconomy = new Biconomy(BICONOMY_URL);
  });
  test("GET /api/v1/meta-tx/resubmitted with Success", async () => {
    nock(BICONOMY_URL)
      .get("/api/v1/meta-tx/resubmitted")
      .query(() => true)
      .reply(200, {
        code: 12,
        message: "message",
        data: {
          oldHash: "oldHash"
        }
      });
    const response = await biconomy.getResubmitted({
      networkId: 31337,
      transactionHash: "txHash"
    });
    expect(response.code).toEqual(12);
  });
  test("POST /api/v2/meta-tx/native", async () => {
    nock(BICONOMY_URL).post("/api/v2/meta-tx/native").reply(200, {
      txHash: "txHash",
      log: "log",
      retryDuration: 0,
      flag: 1
    });
    const response = await biconomy.relayTransaction({
      from: "from",
      to: "to",
      params: []
    });
    expect(response.txHash).toEqual("txHash");
  });
  test("GET /api/v1/meta-tx/resubmitted should fail", async () => {
    await expect(
      new Biconomy(BICONOMY_URL + "xxx").getResubmitted({
        networkId: 31337,
        transactionHash: "txHash"
      })
    ).rejects.toThrow(/reason: getaddrinfo ENOTFOUND/);
  });
  test("POST /api/v2/meta-tx/native should not fail after 2 errors", async () => {
    nock(BICONOMY_URL)
      .post("/api/v2/meta-tx/native")
      .times(2)
      .replyWithError("something awful happened");
    nock(BICONOMY_URL).post("/api/v2/meta-tx/native").times(1).reply(200, {
      txHash: "txHash",
      log: "log",
      retryDuration: 0,
      flag: 1
    });
    const response = await biconomy.relayTransaction({
      from: "from",
      to: "to",
      params: []
    });
    expect(response.txHash).toEqual("txHash");
  });
  test("POST /api/v2/meta-tx/native should fail after 3 errors", async () => {
    nock(BICONOMY_URL)
      .post("/api/v2/meta-tx/native")
      .times(3)
      .replyWithError("something awful happened");
    await expect(
      biconomy.relayTransaction({
        from: "from",
        to: "to",
        params: []
      })
    ).rejects.toThrow(/something awful happened/);
  });
});
