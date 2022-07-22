import React, { useState } from "react";
import { MagnifyingGlass } from "../../icons/MagnifyingGlass";
import { useCoreSdk } from "../../hooks/useCoreSdk";
import { InputField, InputWrapper } from "./SearchBar.styles";
import { subgraph } from "@bosonprotocol/core-sdk";

interface SearchBarProps {
  /**
   * Target chain.
   */
  chainId: number;
  placeholder?: string;
  disabled?: boolean;
  /**
   * Optional callback to invoke with search results.
   */
  onSuccess?: (results: subgraph.BaseMetadataEntityFieldsFragment[]) => void;
  /**
   * Optional callback to invoke if an error happened.
   */
  onError?: (error: Error) => void;
}

export const SearchBar = ({
  placeholder = "Search...",
  disabled = false,
  chainId,
  onSuccess,
  onError
}: SearchBarProps) => {
  const [value, setValue] = useState("");

  const coreSdk = useCoreSdk({ chainId });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setValue(e.target.value);
  };

  const handleEnter = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    try {
      if (e.key === "Enter") {
        e.preventDefault();

        let searchResults: subgraph.BaseMetadataEntityFieldsFragment[] = [];

        const searchResultsDescPromise = coreSdk.getBaseMetadataEntities({
          metadataFilter: {
            description_contains_nocase: value
          }
        });

        const searchResultsNamePromise = coreSdk.getBaseMetadataEntities({
          metadataFilter: {
            name_contains_nocase: value
          }
        });

        const searchResultsIdPromise = coreSdk.getBaseMetadataEntities({
          metadataFilter: {
            offer: value
          }
        });

        const [searchResultsDesc, searchResultsName, searchResultsId] =
          await Promise.all([
            searchResultsDescPromise,
            searchResultsNamePromise,
            searchResultsIdPromise
          ]);

        searchResults = [
          // remove duplicates from search results
          ...new Map(
            [
              ...searchResultsDesc,
              ...searchResultsName,
              ...searchResultsId
            ].map((searchResult) => [searchResult.id, searchResult])
          ).values()
        ];
        onSuccess?.(searchResults);
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
