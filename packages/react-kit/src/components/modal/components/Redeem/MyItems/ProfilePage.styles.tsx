import styled from "styled-components";
import { breakpoint } from "../../../../../lib/ui/breakpoint";
import { theme } from "../../../../../theme";
import GridContainer from "../../../../ui/GridContainer";

const colors = theme.colors.light;

export const LoadingWrapper = styled.div`
  padding: 2rem;
  text-align: center;
  color: ${colors.secondary};
`;

export const ProductGridContainer = styled(GridContainer)`
  grid-row-gap: 3.5rem;
  ${breakpoint.s} {
    grid-row-gap: 2rem;
  }
`;
