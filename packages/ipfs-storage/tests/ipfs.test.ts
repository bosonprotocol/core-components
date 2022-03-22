import { IpfsMetadata } from "../src/ipfs";
import { DEFAULT_THE_GRAPH_IPFS_URL } from "../src/constants";
import { IPFS_HASH } from "@bosonprotocol/common/tests/mocks";

import fetch from "cross-fetch";
jest.mock("cross-fetch");
const mockedFetch = jest.mocked(fetch);
const { Response } = jest.requireActual("cross-fetch");

import * as uint8arrays from "uint8arrays";
jest.mock("uint8arrays");
const mockedUint8arrays = jest.mocked(uint8arrays, true);

import * as ipfsHttpClient from "ipfs-http-client";
jest.mock("ipfs-http-client");
const mockedIpfsHttpClient = jest.mocked(ipfsHttpClient, true);
const { create } = jest.requireActual("ipfs-http-client");

const IPFS_URL = "https://ipfs.api.com:5001";

describe("#fromTheGraphIpfsUrl()", () => {
  it("create instance from default The Graph IPFS url", () => {
    mockedIpfsHttpClient.create.mockReturnValueOnce(
      create({
        url: DEFAULT_THE_GRAPH_IPFS_URL
      })
    );

    const theGraphIpfsStorage = IpfsMetadata.fromTheGraphIpfsUrl();
    const endpointConfig = theGraphIpfsStorage.ipfsClient.getEndpointConfig();

    expect(endpointConfig.host).toEqual("api.thegraph.com");
  });
});

describe("#storeMetadata()", () => {
  it("throw if invalid metadata", async () => {
    const ipfsStorage = new IpfsMetadata({
      url: IPFS_URL
    });

    await expect(ipfsStorage.storeMetadata({} as any)).rejects.toThrow();
  });

  it("return cid if successful", async () => {
    mockedIpfsHttpClient.create.mockReturnValueOnce({
      ...create({
        url: IPFS_URL
      }),
      add: async () => ({
        cid: IPFS_HASH
      })
    });
    const ipfsStorage = new IpfsMetadata({
      url: IPFS_URL
    });

    const cid = await ipfsStorage.storeMetadata({
      title: "title",
      description: "description"
    });

    expect(cid).toEqual(IPFS_HASH);
  });
});

describe("#getMetadata()", () => {
  const METADATA = {
    title: "title",
    description: "description"
  };

  it("get by cid", async () => {
    mockedIpfsHttpClient.create.mockReturnValueOnce({
      ...create({
        url: IPFS_URL
      }),
      cat: () => ({
        [Symbol.asyncIterator]() {
          return {
            next: () => Promise.resolve({ done: true, value: [] })
          };
        }
      })
    });
    mockedUint8arrays.toString.mockReturnValueOnce(JSON.stringify(METADATA));
    const ipfsStorage = new IpfsMetadata({
      url: IPFS_URL
    });

    const metadata = await ipfsStorage.getMetadata(IPFS_HASH);

    expect(metadata).toMatchObject(METADATA);
  });

  it("get by url", async () => {
    mockedIpfsHttpClient.create.mockReturnValueOnce({
      ...create({
        url: IPFS_URL
      })
    });
    mockedFetch.mockResolvedValueOnce(new Response(JSON.stringify(METADATA)));
    const ipfsStorage = new IpfsMetadata({
      url: IPFS_URL
    });

    const metadata = await ipfsStorage.getMetadata(
      "http://ipfs.api.com/METADATA"
    );

    expect(metadata).toMatchObject(METADATA);
  });

  it("throw if retrieved metadata wrong schema", async () => {
    mockedIpfsHttpClient.create.mockReturnValueOnce({
      ...create({
        url: IPFS_URL
      })
    });
    mockedFetch.mockResolvedValueOnce(new Response(JSON.stringify({})));
    const ipfsStorage = new IpfsMetadata({
      url: IPFS_URL
    });

    await expect(
      ipfsStorage.getMetadata("http://ipfs.api.com/METADATA")
    ).rejects.toThrow();
  });
});
