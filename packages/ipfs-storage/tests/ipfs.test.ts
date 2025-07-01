import { IpfsMetadataStorage } from "../src/";
import { BaseIpfsStorage } from "../src/ipfs/base";
import { IPFS_HASH } from "@bosonprotocol/common/tests/mocks";
import { MetadataType, validateMetadata } from "@bosonprotocol/metadata";

import fetch from "cross-fetch";
jest.mock("cross-fetch");
const mockedFetch = jest.mocked(fetch);
const { Response } = jest.requireActual("cross-fetch");

import * as uint8arrays from "uint8arrays";
jest.mock("uint8arrays");
const mockedUint8arrays = jest.mocked(uint8arrays, { shallow: true });

import * as ipfsHttpClient from "ipfs-http-client";
jest.mock("ipfs-http-client");
const mockedIpfsHttpClient = jest.mocked(ipfsHttpClient, { shallow: true });
const { create } = jest.requireActual("ipfs-http-client");

const IPFS_URL = "https://ipfs.api.com:5001";

describe("#storeMetadata()", () => {
  it("throw if invalid metadata", async () => {
    const ipfsStorage = new IpfsMetadataStorage(validateMetadata, {
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
    const ipfsStorage = new IpfsMetadataStorage(validateMetadata, {
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
    const ipfsStorage = new IpfsMetadataStorage(validateMetadata, {
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
    const ipfsStorage = new IpfsMetadataStorage(validateMetadata, {
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
    mockedFetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ type: MetadataType.BASE }))
    );
    const ipfsStorage = new IpfsMetadataStorage(validateMetadata, {
      url: IPFS_URL
    });

    await expect(
      ipfsStorage.getMetadata("http://ipfs.api.com/METADATA")
    ).rejects.toThrow();
  });
});

describe("#get() - BaseIpfsStorage", () => {
  let ipfsStorage: BaseIpfsStorage;

  beforeEach(() => {
    jest.clearAllMocks();
    ipfsStorage = new BaseIpfsStorage({ url: IPFS_URL });
  });

  describe("IPFS URIs", () => {
    it("should handle valid ipfs:// URI with just CID", async () => {
      const mockGetByCID = jest
        .spyOn(ipfsStorage, "getByCID")
        .mockResolvedValue("data");

      await ipfsStorage.get(
        "ipfs://QmYpVHKAYEx8xopJELvyLuvvW99a2heH9GHA8SAuxkoTrz"
      );

      expect(mockGetByCID).toHaveBeenCalledWith(
        "QmYpVHKAYEx8xopJELvyLuvvW99a2heH9GHA8SAuxkoTrz",
        true,
        false
      );
    });

    it("should handle valid ipfs:// URI with CID and path", async () => {
      const mockGetByCID = jest
        .spyOn(ipfsStorage, "getByCID")
        .mockResolvedValue("data");

      await ipfsStorage.get(
        "ipfs://QmYpVHKAYEx8xopJELvyLuvvW99a2heH9GHA8SAuxkoTrz/path/to/file"
      );

      expect(mockGetByCID).toHaveBeenCalledWith(
        "QmYpVHKAYEx8xopJELvyLuvvW99a2heH9GHA8SAuxkoTrz",
        true,
        false
      );
    });

    it("should throw error for ipfs:// URI with invalid CID", async () => {
      await expect(ipfsStorage.get("ipfs://invalidcid")).rejects.toThrow(
        "Invalid IPFS URI: ipfs://invalidcid. CID parsing failed:"
      );
    });
  });

  describe("Raw CIDs", () => {
    it("should handle valid raw CID", async () => {
      const mockGetByCID = jest
        .spyOn(ipfsStorage, "getByCID")
        .mockResolvedValue("data");

      await ipfsStorage.get("QmYpVHKAYEx8xopJELvyLuvvW99a2heH9GHA8SAuxkoTrz");

      expect(mockGetByCID).toHaveBeenCalledWith(
        "QmYpVHKAYEx8xopJELvyLuvvW99a2heH9GHA8SAuxkoTrz",
        true,
        false
      );
    });

    it("should handle valid raw CID with path", async () => {
      const mockGetByCID = jest
        .spyOn(ipfsStorage, "getByCID")
        .mockResolvedValue("data");

      await ipfsStorage.get(
        "QmYpVHKAYEx8xopJELvyLuvvW99a2heH9GHA8SAuxkoTrz/path/to/file"
      );

      expect(mockGetByCID).toHaveBeenCalledWith(
        "QmYpVHKAYEx8xopJELvyLuvvW99a2heH9GHA8SAuxkoTrz",
        true,
        false
      );
    });

    it("should throw error for invalid hash without protocol", async () => {
      await expect(ipfsStorage.get("invalidhash123")).rejects.toThrow(
        "Invalid input: invalidhash123 is neither a valid CID nor a valid URL"
      );
    });
  });

  describe("URLs with protocols", () => {
    it("should handle http:// URLs", async () => {
      const mockGetByURL = jest
        .spyOn(ipfsStorage, "getByURL")
        .mockResolvedValue("data");

      await ipfsStorage.get("http://example.com");

      expect(mockGetByURL).toHaveBeenCalledWith(
        "http://example.com",
        true,
        false
      );
    });

    it("should handle https:// URLs with path", async () => {
      const mockGetByURL = jest
        .spyOn(ipfsStorage, "getByURL")
        .mockResolvedValue("data");

      await ipfsStorage.get("https://example.com/path");

      expect(mockGetByURL).toHaveBeenCalledWith(
        "https://example.com/path",
        true,
        false
      );
    });

    it("should pass ftp:// URLs to getByURL (let fetch handle the error)", async () => {
      const mockGetByURL = jest
        .spyOn(ipfsStorage, "getByURL")
        .mockRejectedValue(new Error("fetch failed"));

      await expect(
        ipfsStorage.get("ftp://example.com/file.txt")
      ).rejects.toThrow("fetch failed");

      expect(mockGetByURL).toHaveBeenCalledWith(
        "ftp://example.com/file.txt",
        true,
        false
      );
    });

    it("should pass file:// URLs to getByURL (let fetch handle the error)", async () => {
      const mockGetByURL = jest
        .spyOn(ipfsStorage, "getByURL")
        .mockRejectedValue(new Error("fetch failed"));

      await expect(ipfsStorage.get("file:///path/to/file")).rejects.toThrow(
        "fetch failed"
      );

      expect(mockGetByURL).toHaveBeenCalledWith(
        "file:///path/to/file",
        true,
        false
      );
    });

    it("should handle data: URLs (treated as invalid input)", async () => {
      // data: URLs don't match the :// protocol pattern, so they're treated as invalid CIDs
      await expect(
        ipfsStorage.get("data:text/plain;base64,SGVsbG8=")
      ).rejects.toThrow(
        "Invalid input: data:text/plain;base64,SGVsbG8= is neither a valid CID nor a valid URL"
      );
    });
  });

  describe("Invalid inputs", () => {
    it("should throw error for empty string", async () => {
      await expect(ipfsStorage.get("")).rejects.toThrow(
        "Invalid input: uriOrHash must be a non-empty string"
      );
    });

    it("should throw error for non-string input", async () => {
      await expect(ipfsStorage.get(null as unknown as string)).rejects.toThrow(
        "Invalid input: uriOrHash must be a non-empty string"
      );
    });

    it("should throw error for undefined input", async () => {
      await expect(
        ipfsStorage.get(undefined as unknown as string)
      ).rejects.toThrow("Invalid input: uriOrHash must be a non-empty string");
    });

    it("should throw error for number input", async () => {
      await expect(ipfsStorage.get(123 as unknown as string)).rejects.toThrow(
        "Invalid input: uriOrHash must be a non-empty string"
      );
    });
  });

  describe("Edge cases", () => {
    it("should handle protocol-like strings that aren't URLs", async () => {
      // This looks like it has a protocol but it's actually invalid
      await expect(ipfsStorage.get("http:invalid")).rejects.toThrow(
        "Invalid input: http:invalid is neither a valid CID nor a valid URL"
      );
    });

    it("should handle ipfs:// with empty CID", async () => {
      await expect(ipfsStorage.get("ipfs://")).rejects.toThrow(
        "Invalid IPFS URI: ipfs://. CID parsing failed:"
      );
    });

    it("should handle ipfs:// with just a slash", async () => {
      await expect(ipfsStorage.get("ipfs:///")).rejects.toThrow(
        "Invalid IPFS URI: ipfs:///. CID parsing failed:"
      );
    });
  });
});
