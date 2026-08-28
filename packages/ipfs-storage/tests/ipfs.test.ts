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

import type NodeFormData from "form-data";
// `form-data` resolves to native `FormData` under a bundler's `browser`
// field. Swap between the two implementations to cover both runtimes.
let mockBrowserFormData = false;
jest.mock("form-data", () => {
  const ActualFormData = jest.requireActual("form-data");
  return function MockFormData() {
    return mockBrowserFormData
      ? new globalThis.FormData()
      : new ActualFormData();
  };
});

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

describe("#add() - BaseIpfsStorage", () => {
  it("uploads to Pinata v3 endpoint and returns CID", async () => {
    mockedFetch.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          data: {
            cid: IPFS_HASH
          }
        })
      )
    );

    const ipfsStorage = new BaseIpfsStorage({
      url: "https://uploads.pinata.cloud/v3/files",
      headers: {
        Authorization: "Bearer token"
      }
    });

    const cid = await ipfsStorage.add(Buffer.from("hello"));

    expect(cid).toEqual(IPFS_HASH);
    expect(mockedFetch).toHaveBeenCalledWith(
      "https://uploads.pinata.cloud/v3/files",
      expect.objectContaining({ method: "POST" })
    );
  });

  it("uploads to legacy Pinata endpoint and returns IpfsHash", async () => {
    mockedFetch.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          IpfsHash: IPFS_HASH
        })
      )
    );

    const ipfsStorage = new BaseIpfsStorage({
      url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
      headers: {
        Authorization: "Bearer token"
      }
    });

    const cid = await ipfsStorage.add(Buffer.from("hello"));

    expect(cid).toEqual(IPFS_HASH);
    expect(mockedFetch).toHaveBeenCalledWith(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      expect.objectContaining({ method: "POST" })
    );
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

const PINATA_V3_URL = "https://uploads.pinata.cloud/v3/files";
const PINATA_LEGACY_URL = "https://api.pinata.cloud/pinning/pinFileToIPFS";

describe("#getByCID() - read path", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("reads through a gateway when the url is a Pinata upload endpoint", async () => {
    mockedFetch.mockResolvedValueOnce(new Response("hello"));
    const ipfsStorage = new BaseIpfsStorage({ url: PINATA_V3_URL });

    const data = await ipfsStorage.getByCID(IPFS_HASH, false, false);

    // cat() would have been spoken at an endpoint that has no IPFS HTTP API.
    expect(mockedFetch).toHaveBeenCalledWith(
      `https://ipfs.io/ipfs/${IPFS_HASH}`
    );
    expect(Buffer.from(data).toString()).toEqual("hello");
  });

  it("prefers an explicit gatewayUrl and normalises its trailing slash", async () => {
    mockedFetch.mockResolvedValueOnce(new Response("hello"));
    const ipfsStorage = new BaseIpfsStorage({
      url: PINATA_V3_URL,
      gatewayUrl: "https://dedicated.mypinata.cloud/ipfs"
    });

    await ipfsStorage.getByCID(IPFS_HASH, false, false);

    expect(mockedFetch).toHaveBeenCalledWith(
      `https://dedicated.mypinata.cloud/ipfs/${IPFS_HASH}`
    );
  });

  it("ignores a gatewayUrl when the url is a real IPFS API", async () => {
    // The local env points at a node holding content no gateway has seen, and
    // its ipfsGateway is the API port - so cat() has to keep winning here.
    mockedIpfsHttpClient.create.mockReturnValueOnce({
      ...create({ url: IPFS_URL }),
      cat: () => ({
        async *[Symbol.asyncIterator]() {
          yield new Uint8Array([1, 2, 3]);
        }
      })
    });
    mockedUint8arrays.concat.mockReturnValueOnce(new Uint8Array([1, 2, 3]));
    const ipfsStorage = new BaseIpfsStorage({
      url: "http://127.0.0.1:5001",
      gatewayUrl: "http://127.0.0.1:5001"
    });

    const data = await ipfsStorage.getByCID(IPFS_HASH, false, false);

    expect(mockedFetch).not.toHaveBeenCalled();
    expect(data).toEqual(new Uint8Array([1, 2, 3]));
  });

  it("throws with the status when the gateway rejects the read", async () => {
    mockedFetch.mockResolvedValueOnce(
      new Response("nope", { status: 504, statusText: "Gateway Timeout" })
    );
    const ipfsStorage = new BaseIpfsStorage({ url: PINATA_V3_URL });

    await expect(ipfsStorage.getByCID(IPFS_HASH, false, false)).rejects.toThrow(
      `Failed to fetch ${IPFS_HASH}`
    );
  });

  it("still uses ipfsClient.cat() when no gateway applies", async () => {
    mockedIpfsHttpClient.create.mockReturnValueOnce({
      ...create({ url: IPFS_URL }),
      cat: () => ({
        async *[Symbol.asyncIterator]() {
          yield new Uint8Array([1, 2]);
          yield new Uint8Array([3]);
        }
      })
    });
    mockedUint8arrays.concat.mockReturnValueOnce(new Uint8Array([1, 2, 3]));
    const ipfsStorage = new BaseIpfsStorage({ url: IPFS_URL });

    const data = await ipfsStorage.getByCID(IPFS_HASH, false, false);

    expect(mockedFetch).not.toHaveBeenCalled();
    expect(mockedUint8arrays.concat).toHaveBeenCalledWith([
      new Uint8Array([1, 2]),
      new Uint8Array([3])
    ]);
    expect(data).toEqual(new Uint8Array([1, 2, 3]));
  });

  it("returns a Blob without going through Buffer", async () => {
    mockedFetch.mockResolvedValueOnce(new Response("hello"));
    const ipfsStorage = new BaseIpfsStorage({ url: PINATA_V3_URL });

    const blob = await ipfsStorage.getByCID(IPFS_HASH, false, true);

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toEqual(5);
    expect(await blob.text()).toEqual("hello");
  });

  it("parses JSON when asJson is set", async () => {
    mockedFetch.mockResolvedValueOnce(new Response('{"a":1}'));
    mockedUint8arrays.toString.mockReturnValueOnce('{"a":1}');
    const ipfsStorage = new BaseIpfsStorage({ url: PINATA_V3_URL });

    await expect(ipfsStorage.getByCID(IPFS_HASH, true, false)).resolves.toEqual(
      { a: 1 }
    );
  });
});

describe("#add() - Pinata failure modes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("surfaces the status and body when the upload is rejected", async () => {
    mockedFetch.mockResolvedValueOnce(
      new Response("quota exceeded", {
        status: 500,
        statusText: "Internal Server Error"
      })
    );
    const ipfsStorage = new BaseIpfsStorage({ url: PINATA_V3_URL });

    await expect(ipfsStorage.add("hello")).rejects.toThrow(
      "Pinata upload failed (500 Internal Server Error): quota exceeded"
    );
  });

  it("throws when the upload succeeds but no CID comes back", async () => {
    mockedFetch.mockResolvedValueOnce(new Response(JSON.stringify({})));
    const ipfsStorage = new BaseIpfsStorage({ url: PINATA_V3_URL });

    await expect(ipfsStorage.add("hello")).rejects.toThrow(
      "Pinata upload succeeded but response did not include a CID"
    );
  });
});

describe("#add() - authorization header", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("sends no Authorization when no headers are configured", async () => {
    mockedFetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ IpfsHash: IPFS_HASH }))
    );
    const ipfsStorage = new BaseIpfsStorage({ url: PINATA_LEGACY_URL });

    await ipfsStorage.add("hello");

    const init = mockedFetch.mock.calls[0][1] as { headers: object };
    expect(init.headers).not.toHaveProperty("Authorization");
  });

  it("reads the token from a Headers instance", async () => {
    mockedFetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ cid: IPFS_HASH }))
    );
    const ipfsStorage = new BaseIpfsStorage({
      url: PINATA_V3_URL,
      headers: new Headers({ authorization: "Bearer from-headers-object" })
    });

    await ipfsStorage.add("hello");

    const init = mockedFetch.mock.calls[0][1] as {
      headers: Record<string, string>;
    };
    expect(init.headers.Authorization).toEqual("Bearer from-headers-object");
  });

  it("sends no Authorization when a Headers instance carries none", async () => {
    mockedFetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ cid: IPFS_HASH }))
    );
    const ipfsStorage = new BaseIpfsStorage({
      url: PINATA_V3_URL,
      headers: new Headers({ "content-language": "en" })
    });

    await ipfsStorage.add("hello");

    const init = mockedFetch.mock.calls[0][1] as { headers: object };
    expect(init.headers).not.toHaveProperty("Authorization");
  });

  it("reads the token case-insensitively from a plain record", async () => {
    mockedFetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ cid: IPFS_HASH }))
    );
    const ipfsStorage = new BaseIpfsStorage({
      url: PINATA_V3_URL,
      headers: { AUTHORIZATION: "Bearer from-record" }
    });

    await ipfsStorage.add("hello");

    const init = mockedFetch.mock.calls[0][1] as {
      headers: Record<string, string>;
    };
    expect(init.headers.Authorization).toEqual("Bearer from-record");
  });
});

describe("#getByURL() - response shapes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns text when asJson and asBlob are both false", async () => {
    mockedFetch.mockResolvedValueOnce(new Response("plain body"));
    const ipfsStorage = new BaseIpfsStorage({ url: IPFS_URL });

    await expect(
      ipfsStorage.getByURL("https://ipfs.api.com/thing", false, false)
    ).resolves.toEqual("plain body");
  });

  it("returns a Blob when asBlob is set", async () => {
    mockedFetch.mockResolvedValueOnce(new Response("plain body"));
    const ipfsStorage = new BaseIpfsStorage({ url: IPFS_URL });

    const blob = await ipfsStorage.getByURL(
      "https://ipfs.api.com/thing",
      false,
      true
    );

    // Not an `instanceof Blob` check: this comes straight from the fetch
    // implementation's own Blob class, which is not the global one.
    expect(blob.size).toEqual("plain body".length);
    expect(await blob.text()).toEqual("plain body");
  });
});

describe("#add() - Pinata payload shapes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockBrowserFormData = false;
  });

  async function addAndReadNodeBody(
    value: Parameters<BaseIpfsStorage["add"]>[0]
  ) {
    mockedFetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ data: { cid: IPFS_HASH } }))
    );
    const ipfsStorage = new BaseIpfsStorage({ url: PINATA_V3_URL });

    const cid = await ipfsStorage.add(value);

    const init = mockedFetch.mock.calls[0][1] as unknown as {
      headers: Record<string, string>;
      body: NodeFormData;
    };
    return { cid, init, body: init.body.getBuffer().toString("latin1") };
  }

  it("uploads a File under its own name and content type", async () => {
    const { cid, init, body } = await addAndReadNodeBody(
      new File(["hello"], "avatar.png", { type: "image/png" })
    );

    expect(cid).toEqual(IPFS_HASH);
    expect(body).toContain('filename="avatar.png"');
    expect(body).toContain("Content-Type: image/png");
    expect(body).toContain("hello");
    // The v3 endpoint rejects an upload that does not name a network.
    expect(body).toContain('name="network"');
    expect(init.headers["content-type"]).toMatch(/^multipart\/form-data;/);
  });

  it("uploads a Blob under the default filename", async () => {
    const { body } = await addAndReadNodeBody(
      new Blob(["blob body"], { type: "text/plain" })
    );

    expect(body).toContain('filename="file"');
    expect(body).toContain("blob body");
  });

  it("uploads an ArrayBuffer", async () => {
    const { body } = await addAndReadNodeBody(
      new TextEncoder().encode("buffered").buffer as ArrayBuffer
    );

    expect(body).toContain("buffered");
  });

  it("rejects a payload it cannot turn into a file part", async () => {
    const ipfsStorage = new BaseIpfsStorage({ url: PINATA_V3_URL });

    await expect(ipfsStorage.add(42 as never)).rejects.toThrow(
      "Unsupported Pinata upload payload"
    );
    expect(mockedFetch).not.toHaveBeenCalled();
  });
});

describe("#add() - browser FormData", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockBrowserFormData = true;
  });

  afterEach(() => {
    mockBrowserFormData = false;
  });

  it("builds a native FormData and leaves content-type to the runtime", async () => {
    mockedFetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ data: { cid: IPFS_HASH } }))
    );
    const ipfsStorage = new BaseIpfsStorage({
      url: PINATA_V3_URL,
      headers: { Authorization: "Bearer token" }
    });

    const cid = await ipfsStorage.add(
      new File(["hello"], "avatar.png", { type: "image/png" })
    );

    expect(cid).toEqual(IPFS_HASH);
    const init = mockedFetch.mock.calls[0][1] as unknown as {
      headers: Record<string, string>;
      body: FormData;
    };
    // A boundary the runtime has not chosen yet cannot be announced up front.
    expect(Object.keys(init.headers).map((key) => key.toLowerCase())).toEqual([
      "authorization"
    ]);
    expect(init.body).toBeInstanceOf(FormData);
    const file = init.body.get("file") as File;
    expect(file.name).toEqual("avatar.png");
    expect(file.type).toEqual("image/png");
    expect(await file.text()).toEqual("hello");
    expect(init.body.get("network")).toEqual("public");
  });

  it("wraps a string payload in a Blob", async () => {
    mockedFetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ cid: IPFS_HASH }))
    );
    const ipfsStorage = new BaseIpfsStorage({ url: PINATA_LEGACY_URL });

    await ipfsStorage.add("plain text");

    const init = mockedFetch.mock.calls[0][1] as unknown as { body: FormData };
    const file = init.body.get("file") as File;
    expect(await file.text()).toEqual("plain text");
    // The legacy endpoint takes no `network` field.
    expect(init.body.get("network")).toBeNull();
  });
});

describe("#unpin()", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("delegates to ipfsClient.pin.rm for a real IPFS API", async () => {
    const rm = jest.fn().mockResolvedValue(undefined);
    mockedIpfsHttpClient.create.mockReturnValueOnce({
      ...create({ url: IPFS_URL }),
      pin: { rm }
    });
    const ipfsStorage = new BaseIpfsStorage({ url: IPFS_URL });

    await ipfsStorage.unpin(IPFS_HASH);

    expect(rm).toHaveBeenCalledWith(IPFS_HASH);
  });

  it("is a no-op against a Pinata upload endpoint", async () => {
    const rm = jest.fn();
    mockedIpfsHttpClient.create.mockReturnValueOnce({
      ...create({ url: PINATA_V3_URL }),
      pin: { rm }
    });
    const ipfsStorage = new BaseIpfsStorage({ url: PINATA_V3_URL });

    await expect(ipfsStorage.unpin(IPFS_HASH)).resolves.toBeUndefined();

    expect(rm).not.toHaveBeenCalled();
  });
});
