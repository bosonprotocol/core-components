import { css, createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 62.5%;
  }

  html, body, #__next {
    height: 100%;
  }

  body {
    font-family: 'Plus Jakarta Sans', 'Roboto', sans-serif;
    font-style: normal;
  }

  input,
  select,
  textarea {
    :focus,
    :hover {
      outline: none;
    }
    cursor: pointer;
  }
  input,
  select {
    -webkit-appearance: none;
  }
`;

export const transition = css`
  transition: all ${({ theme }) => theme?.transition?.time || "150ms"}
    ${({ theme }) => theme?.transition?.timing || "ease-in-out"};
`;
export default GlobalStyle;
