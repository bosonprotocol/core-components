import { IMetadata, ERC721Metadata, ERC721MetadataAlt, AnyMetadata, MetadataStorage, tValidateMetadata } from "../src";

function buildAnyMetadata() {
  return {
    type: "myType",
    schemaUrl: "mySchema",
    animationUrl: "animationUrl",
    external_link: "external_link",
    attributes: [
      {
        display_type: "display_type",
        value: "value",
        trait_type: "trait_type"
      },{
        displayType: "displayType",
        value: "value",
        traitType: "traitType"
      }
    ]
  }
}

function checkAnyMetadata(metadata: AnyMetadata) {
  expect(metadata).toBeTruthy();
  expect(metadata.type).toBeTruthy();
  expect(metadata.schemaUrl).toBeTruthy();
  expect(metadata.animationUrl).toBeTruthy();
  expect(metadata.external_link).toBeTruthy();
  expect(metadata.attributes).toBeTruthy();
  expect(metadata.attributes?.[0].display_type).toBeTruthy();
  expect(metadata.attributes?.[0].trait_type).toBeTruthy();
  expect(metadata.attributes?.[1].displayType).toBeTruthy();
  expect(metadata.attributes?.[1].traitType).toBeTruthy();
}

describe("index entrypoint", () => {
  test("export IMetadata", () => {
    const myMetadata: IMetadata = {
      type: "myType",
      schemaUrl: "mySchema"
    };
    expect(myMetadata).toBeTruthy();
    expect(myMetadata.type).toBeTruthy();
    expect(myMetadata.schemaUrl).toBeTruthy();
  });
  test("export ERC721Metadata", () => {
    const myMetadata: ERC721Metadata = {
      external_link: "external_link"
    };
    expect(myMetadata).toBeTruthy();
    expect(myMetadata.external_link).toBeTruthy();
  });
  test("export ERC721MetadataAlt", () => {
    const myMetadata: ERC721MetadataAlt = {
      animationUrl: "animationUrl"
    };
    expect(myMetadata).toBeTruthy();
    expect(myMetadata.animationUrl).toBeTruthy();
  });
  test("export AnyMetadata", () => {
    const myMetadata: AnyMetadata = buildAnyMetadata();
    checkAnyMetadata(myMetadata);
  });
  test("export MetadataStorage", async () => {
    const myStorage: MetadataStorage = {
      getMetadata: async () => {
        return buildAnyMetadata();
      },
      storeMetadata: async (metadata) => {
        checkAnyMetadata(metadata);
        return "cid";
      }
    };
    const myMetadata = await myStorage.getMetadata("");
    expect(myMetadata).toBeTruthy();
    const cid = await myStorage.storeMetadata(myMetadata);
    expect(cid).toBeTruthy();
  });
  test("export tValidateMetadata", () => {
    const validate: tValidateMetadata = (metadata) => {
      checkAnyMetadata(metadata);
    };
    expect(validate).toBeTruthy();
  });
});
