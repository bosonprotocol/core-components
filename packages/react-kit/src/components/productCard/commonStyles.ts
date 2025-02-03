import { css } from "styled-components";
import { getCssVar } from "../../theme";

export const cardWrapperStyles = css`
  padding: 0px;
  isolation: isolate;
  width: 100%;
  background: ${getCssVar("--background-accent-color")};
`;
