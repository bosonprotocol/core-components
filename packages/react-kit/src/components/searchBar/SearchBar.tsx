import React, { useState } from "react";
import { MagnifyingGlass } from "../../icons/MagnifyingGlass";
import { useCoreSdk } from "../../hooks/useCoreSdk";
import { InputField, InputWrapper } from "./SearchBar.styles";
import { subgraph } from "@bosonprotocol/core-sdk";
import { EnvironmentType } from "@bosonprotocol/common/src/types";

interface SearchBarProps {
  /**
   * Target environment.
   */
  envName: EnvironmentType;
  placeholder?: string;
  disabled?: boolean;
  /**
   * Optional callback to invoke with search results.
   */
  onSuccess?: (results: {
    products: subgraph.BaseMetadataEntityFieldsFragment[];
    buyers: subgraph.BuyerFieldsFragment[];
    sellers: subgraph.SellerFieldsFragment[];
  }) => void;
  /**
   * Optional callback to invoke if an error happened.
   */
  onError?: (error: Error) => void;
}

export const SearchBar = ({
  placeholder = "Search...",
  disabled = false,
  envName,
  onSuccess,
  onError
}: SearchBarProps) => {
  const [value, setValue] = useState("");

  const coreSdk = useCoreSdk({ envName });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setValue(e.target.value);
  };

  const handleEnter = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    try {
      if (e.key === "Enter") {
        e.preventDefault();

        let productSearchResults: subgraph.BaseMetadataEntityFieldsFragment[] =
          [];

        const productSearchResultsDescPromise = coreSdk.getBaseMetadataEntities(
          {
            metadataFilter: {
              description_contains_nocase: value
            }
          }
        );

        const productSearchResultsNamePromise = coreSdk.getBaseMetadataEntities(
          {
            metadataFilter: {
              name_contains_nocase: value
            }
          }
        );

        const productSearchResultsIdPromise = coreSdk.getBaseMetadataEntities({
          metadataFilter: {
            offer: value
          }
        });

        const sellerByIdPromise = coreSdk.getSellerById(value);

        const sellerByAddressPromise = coreSdk.getSellersByAddress(value);

        const buyerByAddressPromise = coreSdk.getBuyers({
          buyersFilter: {
            wallet: value
          }
        });

        const buyerByIdPromise = coreSdk.getBuyers({
          buyersFilter: {
            id: value
          }
        });

        const [
          productSearchResultsDesc,
          productSearchResultsName,
          productSearchResultsId,
          sellerById,
          sellerByAddress,
          buyerById,
          buyerByAddress
        ] = await Promise.all([
          productSearchResultsDescPromise,
          productSearchResultsNamePromise,
          productSearchResultsIdPromise,
          sellerByIdPromise,
          sellerByAddressPromise,
          buyerByIdPromise,
          buyerByAddressPromise
        ]);

        const sellerByAddressList = sellerByAddress?.length
          ? sellerByAddress
          : [];
        const sellerByIdList = sellerById ? [sellerById] : [];

        productSearchResults = [
          // remove duplicates from search results
          ...new Map(
            [
              ...productSearchResultsDesc,
              ...productSearchResultsName,
              ...productSearchResultsId
            ].map((searchResult) => [searchResult.id, searchResult])
          ).values()
        ];

        const buyers = [...buyerById, ...buyerByAddress];

        const sellers = [...sellerByIdList, ...sellerByAddressList];

        onSuccess?.({ products: productSearchResults, buyers, sellers });
      }
    } catch (error) {
      onError?.(error as Error);
    }
  };

  return (
    <InputWrapper disabled={disabled}>
      <MagnifyingGlass />
      <InputField
        value={value}
        name="search"
        type="text"
        placeholder={placeholder}
        onKeyDown={handleEnter}
        onChange={handleChange}
        disabled={disabled}
      />
    </InputWrapper>
  );
};
