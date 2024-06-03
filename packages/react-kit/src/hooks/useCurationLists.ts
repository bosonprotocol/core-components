import { useBosonContext } from "../components/boson/BosonProvider";

export function useCurationLists() {
  const {
    enableCurationLists,
    sellerCurationList,
    offerCurationList,
    withOwnProducts
  } = useBosonContext();

  return {
    enableCurationLists:
      withOwnProducts === "all"
        ? false
        : ["mine", "custom"].includes(withOwnProducts || "")
          ? true
          : enableCurationLists,
    sellerCurationList: sellerCurationList,
    offerCurationList: offerCurationList
  };
}
