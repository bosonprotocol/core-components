import { IpfsMetadataStorage } from "../src/";
import { IPFS_HASH } from "@bosonprotocol/common/tests/mocks";
import { MetadataType } from "@bosonprotocol/metadata";

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

describe("#storeMetadata()", () => {
  it("throw if invalid metadata", async () => {
    const ipfsStorage = new IpfsMetadataStorage({
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
    const ipfsStorage = new IpfsMetadataStorage({
      url: IPFS_URL
    });

    const cid = await ipfsStorage.storeMetadata({
      name: "name",
      description: "description",
      schemaUrl: "schemaUrl",
      externalUrl: "externalUrl",
      animationUrl: "animationUrl",
      licenseUrl: "licenseUrl",
      type: MetadataType.BASE
    });

    expect(cid).toEqual(IPFS_HASH);
  });
});

describe("#getMetadata()", () => {
  const METADATA_FROM_IPFS = {
    name: "name",
    description: "description",
    schemaUrl: "schemaUrl",
    externalUrl: "externalUrl",
    external_url: "externalUrl",
    animationUrl: "animationUrl",
    animation_url: "animation_url",
    licenseUrl: "licenseUrl",
    type: MetadataType.BASE
  };

  const EXPECTED_METADATA = {
    name: METADATA_FROM_IPFS.name,
    description: METADATA_FROM_IPFS.description,
    schemaUrl: METADATA_FROM_IPFS.schemaUrl,
    externalUrl: METADATA_FROM_IPFS.externalUrl,
    animationUrl: METADATA_FROM_IPFS.animationUrl,
    licenseUrl: METADATA_FROM_IPFS.licenseUrl,
    type: METADATA_FROM_IPFS.type
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
    mockedUint8arrays.toString.mockReturnValueOnce(
      JSON.stringify(METADATA_FROM_IPFS)
    );
    const ipfsStorage = new IpfsMetadataStorage({
      url: IPFS_URL
    });

    const metadata = await ipfsStorage.getMetadata(IPFS_HASH);

    expect(metadata).toMatchObject(EXPECTED_METADATA);
  });

  it("get by url", async () => {
    mockedIpfsHttpClient.create.mockReturnValueOnce({
      ...create({
        url: IPFS_URL
      })
    });
    mockedFetch.mockResolvedValueOnce(
      new Response(JSON.stringify(METADATA_FROM_IPFS))
    );
    const ipfsStorage = new IpfsMetadataStorage({
      url: IPFS_URL
    });

    const metadata = await ipfsStorage.getMetadata(
      "http://ipfs.api.com/METADATA"
    );
    expect(metadata).toMatchObject(EXPECTED_METADATA);
  });

  it("throw if retrieved metadata wrong schema", async () => {
    mockedIpfsHttpClient.create.mockReturnValueOnce({
      ...create({
        url: IPFS_URL
      })
    });
    mockedFetch.mockResolvedValueOnce(new Response(JSON.stringify({})));
    const ipfsStorage = new IpfsMetadataStorage({
      url: IPFS_URL
    });

    await expect(
      ipfsStorage.getMetadata("http://ipfs.api.com/METADATA")
    ).rejects.toThrow();
  });
});
