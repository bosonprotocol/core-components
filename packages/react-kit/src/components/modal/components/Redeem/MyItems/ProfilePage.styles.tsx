import styled from "styled-components";
import { breakpoint } from "@bosonprotocol/utils";
import { GridContainer } from "../../../../ui/GridContainer";

export const ProductGridContainer = styled(GridContainer)`
  grid-row-gap: 3.5rem;
  ${breakpoint.s} {
    grid-row-gap: 2rem;
  }
`;
