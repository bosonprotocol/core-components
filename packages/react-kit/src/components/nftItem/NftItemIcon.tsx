import { NftItemMetadataEntity } from "@bosonprotocol/core-sdk/dist/cjs/subgraph";
import React from "react";
import IpfsImage from "../ui/IpfsImage";
import Video from "../ui/Video";

type NftItemIconProps = {
  nftItem: NftItemMetadataEntity;
};

export const NftItemIcon: React.FC<NftItemIconProps> = ({ nftItem }) => {
  return nftItem.image ? (
    <IpfsImage src={nftItem.image} />
  ) : nftItem.animationUrl ? (
    <Video src={nftItem.animationUrl} />
  ) : null;
};
