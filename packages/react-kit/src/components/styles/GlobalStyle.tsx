import { createGlobalStyle } from "styled-components";
import { breakpoint } from "@bosonprotocol/utils";
import { zIndex } from "../ui/zIndex";
import { cssVars } from "./ResetStylesForNonWidgets";
import { getCssVar } from "../../theme";

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: barlow;
    src: url(src/assets/fonts/Barlow-Regular.ttf);
    font-weight: normal;
  }
  * {
    box-sizing: border-box;
    /* zIndex for wallet connect legacy view */    
    --wcm-z-index: ${zIndex.Modal + 100};
  }
  :root {
    ${cssVars}

    font-size: 0.75rem;
    ${breakpoint.xs} {
      font-size: 0.75rem;
    }
    ${breakpoint.s} {
      font-size: 0.875rem;
    }
    ${breakpoint.m} {
      font-size: 0.875rem;
    }
    ${breakpoint.l} {
      font-size: 1rem;
    }
    ${breakpoint.xl} {
      font-size: 1rem;
    }
  }

  button {
    all: unset;
  }

  html, body {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;

    margin: 0;
    padding: 0;

    color: ${getCssVar("--main-text-color")};

    font-family: "Plus Jakarta Sans";
    font-style: normal;

    max-height: 100vh;
  }



  a,
  button,
  input,
  select,
  textarea {
    text-decoration: none;
    &:focus,
    &:hover {
      outline: none;
    }
    cursor: pointer;
  }

  select {
    -webkit-appearance: none;
  }

  input {
    user-select: text;
  }

  * > small {
    font-size: 65%;
    margin: 0 0.5rem;
    opacity: 0.75;
    white-space: pre;
  }

  h1 {
    font-size: 3.5rem;
    font-weight: 600;
    line-height: 1.2;
  }
  h2 {
    font-size: 2rem;
    font-weight: 600;
    line-height: 1.2;
  }
  h3 {
    font-size: 1.5rem;
    font-weight: 600;
    line-height: 1.5;
  }
  h4, h5, h6 {
    font-size: 1.25rem;
    line-height: 1.5;
    margin: 0 0 1rem 0;
  }
  a, p, span, div {
    font-size: 1rem;
    line-height: 1.5;
  }
  img, svg {
    user-select: none;
  }

  [data-rk][role=dialog] {
    top: 0; // rainbowkit modal backdrop should fill up all height
    height: 100%;
  }
`;
export default GlobalStyle;
