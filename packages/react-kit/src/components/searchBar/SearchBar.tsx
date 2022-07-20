import React, { useState } from "react";
import styled from "styled-components";
import { MagnifyingGlass } from "../../icons/MagnifyingGlass";
import { useCoreSdk } from "../../hooks/useCoreSdk";

interface SearchBarProps {
  placeholder?: string;
  disabled?: boolean;
}

export const SearchBar = ({
  placeholder = "Search...",
  disabled = false
}: SearchBarProps) => {
  const [value, setValue] = useState("");

  const coreSdk = useCoreSdk({ chainId: 1234 });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    console.log("🚀 ~ file: SearchBar.tsx ~ line 19 ~ handleChange ~ e", e);
    setValue(e.target.value);
  };

  const handleEnter = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      console.log(`search with =>${value}`);
      const sample = await coreSdk.getOffers({ name_contains_nocase: value });
    }
  };

  return (
    <InputWrapper>
      <MagnifyingGlass />
      <InputField
        value={value}
        name="search"
        type="text"
        placeholder={placeholder}
        onKeyDown={handleEnter}
        onChange={(e) => {
          console.log("🚀 ~ file: SearchBar.tsx ~ line 41 ~ e", e);
          handleChange(e);
        }}
        disabled={disabled}
      />
    </InputWrapper>
  );
};

const InputWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0.5rem 1rem;
  gap: 1rem;
  height: 2.5rem;
  left: 1.25rem;
  background: ${({ theme }) => theme?.colors?.light.lightGrey};
`;

const InputField = styled.input`
  border: none;
  height: 1.563rem;
  width: 100%;
  background-color: ${({ theme }) => theme?.colors?.light.lightGrey};
  font-size: 1rem;
  line-height: 150%;
  vertical-align: middle;
  :focus {
    outline: none;
    color: ${({ theme }) => theme?.colors?.light.secondary};
  }
  :focus::placeholder {
    color: transparent;
  }
`;
