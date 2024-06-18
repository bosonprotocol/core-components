export interface IMetadata {
  type: string;
  schemaUrl?: string;
}

export type ERC721Metadata = {
  image_data?: string;
  external_url?: string;
  animation_url?: string;
  youtube_url?: string;
  external_link?: string;
  attributes?: {
    trait_type: string;
    value: string;
    display_type?: string;
  }[];
};

export type ERC721MetadataAlt = {
  imageData?: string;
  externalUrl?: string;
  animationUrl?: string;
  youtubeUrl?: string;
  externalLink?: string;
  attributes?: {
    trait_type?: string;
    traitType?: string;
    value: string;
    display_type?: string;
    displayType?: string;
  }[];
};

export type AnyMetadata = IMetadata &
  Record<string, unknown> &
  Omit<ERC721Metadata, "attributes"> &
  ERC721MetadataAlt;

export interface MetadataStorage {
  getMetadata(metadataUri: string): Promise<AnyMetadata>;
  storeMetadata(metadata: AnyMetadata): Promise<string>;
}

export type tValidateMetadata = (metadata: AnyMetadata) => void;
