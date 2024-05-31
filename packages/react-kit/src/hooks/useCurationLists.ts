import { useConfigContext } from "../components/config/ConfigContext";

export function useCurationLists() {
  const {
    enableCurationLists,
    sellerCurationList,
    offerCurationList,
    withOwnProducts
  } = useConfigContext();

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
