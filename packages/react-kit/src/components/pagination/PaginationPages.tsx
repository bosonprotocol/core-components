import React from "react";
import styled from "styled-components";
import { theme } from "../../theme";

const Span = styled.span`
  font-size: 0.75rem;
  color: ${theme.colors.light.greyDark};
  &:not(:last-of-type) {
    margin-right: 1rem;
  }
`;

interface Props {
  pageIndex: number;
  pageSize: number;
  allItems: number;
}
export default function PaginationPages({
  pageIndex,
  pageSize,
  allItems
}: Props) {
  const start = pageSize * pageIndex - (pageSize - 1);
  const end = pageSize * pageIndex;

  return (
    <Span>
      Showing {start} - {end > allItems ? allItems : end} of {allItems} entries
    </Span>
  );
}
