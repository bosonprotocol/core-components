export type Metadata = {
  title: string;
  description: string;
  additionalProperties?: string;
};

export interface MetadataStorage {
  getMetadata(metadataUri: string): Promise<Metadata>;
  storeMetadata(metadata: Metadata): Promise<string>;
}
