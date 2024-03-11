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
type ProductV1Sub = Pick<
  subgraph.ProductV1MetadataEntity,
  "shipping" | "productOverrides"
> & {
  product: Pick<
    subgraph.ProductV1MetadataEntity["product"],
    "title" | "description" | "visuals_images" | "productV1Seller"
  >;
  productV1Seller: Pick<
    subgraph.ProductV1MetadataEntity["productV1Seller"],
    "images" | "description"
  >;
};
type ProductV1Subitem = Pick<
  subgraph.ProductV1ItemMetadataEntity,
  "shipping" | "productOverrides"
> & {
  product: Pick<
    subgraph.ProductV1ItemMetadataEntity["product"],
    "title" | "description" | "visuals_images" | "productV1Seller"
  >;
  productV1Seller: Pick<
    subgraph.ProductV1ItemMetadataEntity["productV1Seller"],
    "images" | "description"
  >;
};
export const getOfferDetails = (
  offer: Offer | subgraph.OfferFieldsFragment
): IGetOfferDetails => {
  const productV1ItemMetadataEntity:
    | ProductV1Sub
    | ProductV1Subitem
    | undefined = isProductV1(offer)
    ? (offer.metadata as ProductV1Sub)
    : isBundle(offer)
    ? (offer.metadata?.items?.find((item) => isProductV1Item(item)) as
        | ProductV1Subitem
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
    artist?.description ||
    productV1ItemMetadataEntity?.product.productV1Seller?.description ||
    "";
  const images =
    productV1ItemMetadataEntity?.product?.visuals_images?.map(
      ({ url }: { url: string }) => url
    ) || [];
  const variantsImages =
    productV1ItemMetadataEntity?.productOverrides?.visuals_images?.map(
      ({ url }: { url: string }) => url
    ) || [];
  const bundleItems = isBundle(offer) ? offer.metadata.items : undefined;
  const nftItems = bundleItems
    ? bundleItems.filter((item): item is subgraph.NftItemMetadataEntity =>
        isNftItem(item)
      )
    : undefined;
  const mainImage = offerImg || variantsImages?.[0] || images?.[0] || "";
  return {
    display: false,
    name,
    offerImg,
    animationUrl,
    shippingInfo,
    description,
    artist,
    artistDescription,
    images: variantsImages?.length ? variantsImages : images,
    bundleItems,
    nftItems,
    mainImage
  };
};
