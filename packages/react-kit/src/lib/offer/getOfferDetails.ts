import { subgraph } from "@bosonprotocol/core-sdk";
import { Offer } from "../../types/offer";
import { getOfferAnimationUrl } from "./getOfferAnimationUrl";
import { isBundle, isProductV1 } from "./filter";
import { isNftItem, isProductV1Item } from "../bundle/filter";

interface ITable {
  name: string;
  value: string;
}
interface IShippingInfo {
  returnPeriodInDays: number | undefined;
  shippingTable: Array<ITable>;
}

type ProductV1OrProductV1ItemSubProductV1Seller =
  | Pick<
      subgraph.ProductV1ItemMetadataEntity["productV1Seller"],
      "images" | "description"
    >
  | Pick<
      subgraph.ProductV1MetadataEntity["productV1Seller"],
      "images" | "description"
    >;
interface IGetOfferDetails {
  display: boolean;
  name: string;
  offerImg: string | undefined;
  mainImage: string;
  animationUrl: string;
  shippingInfo: IShippingInfo;
  description: string;
  artist: ProductV1OrProductV1ItemSubProductV1Seller | null;
  artistDescription: string;
  images: Array<string>;
  nftItems: subgraph.NftItemMetadataEntity[] | undefined;
  bundleItems:
    | Extract<
        subgraph.OfferFieldsFragment["metadata"],
        { __typename: "BundleMetadataEntity" }
      >["items"]
    | undefined;
}

export const getOfferDetails = (
  offer: Offer | subgraph.OfferFieldsFragment
): IGetOfferDetails => {
  const productV1ItemMetadataEntity:
    | (Pick<subgraph.ProductV1MetadataEntity, "shipping"> & {
        product: Pick<
          subgraph.ProductV1MetadataEntity["product"],
          "title" | "description" | "visuals_images"
        >;
        productV1Seller: Pick<
          subgraph.ProductV1MetadataEntity["productV1Seller"],
          "images" | "description"
        >;
      })
    | (Pick<subgraph.ProductV1ItemMetadataEntity, "shipping"> & {
        product: Pick<
          subgraph.ProductV1ItemMetadataEntity["product"],
          "title" | "description" | "visuals_images"
        >;
        productV1Seller: Pick<
          subgraph.ProductV1ItemMetadataEntity["productV1Seller"],
          "images" | "description"
        >;
      })
    | undefined = isProductV1(offer)
    ? offer.metadata
    : isBundle(offer)
    ? (offer.metadata?.items?.find((item) => isProductV1Item(item)) as
        | subgraph.ProductV1ItemMetadataEntity
        | undefined)
    : undefined;
  const name =
    productV1ItemMetadataEntity?.product?.title ||
    offer.metadata?.name ||
    "Untitled";
  const offerImg = offer.metadata?.image;

  const animationUrl = getOfferAnimationUrl(offer);
  const shippingInfo = {
    returnPeriodInDays:
      productV1ItemMetadataEntity?.shipping?.returnPeriodInDays,
    shippingTable:
      productV1ItemMetadataEntity?.shipping?.supportedJurisdictions?.map(
        (jurisdiction: any) => ({
          name: jurisdiction.label,
          value: jurisdiction.deliveryTime
        })
      ) || []
  };
  const description =
    productV1ItemMetadataEntity?.product?.description ||
    offer.metadata?.description ||
    "";
  const artist = productV1ItemMetadataEntity?.productV1Seller || null;
  const artistDescription =
    productV1ItemMetadataEntity?.productV1Seller?.description || "";
  const images =
    productV1ItemMetadataEntity?.product?.visuals_images?.map(
      ({ url }: { url: string }) => url
    ) || [];
  const bundleItems = isBundle(offer) ? offer.metadata.items : undefined;
  const nftItems = bundleItems
    ? bundleItems.filter((item): item is subgraph.NftItemMetadataEntity =>
        isNftItem(item)
      )
    : undefined;
  const mainImage = offerImg || images?.[0] || "";
  return {
    display: false,
    name,
    offerImg,
    animationUrl,
    shippingInfo,
    description,
    artist,
    artistDescription,
    images,
    bundleItems,
    nftItems,
    mainImage
  };
};
