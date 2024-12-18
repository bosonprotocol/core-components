import "styled-components";
/*eslint sort-keys: "error"*/

export const colors = {
  arsenic: "#3a364f",
  black: "#09182C",
  blue: "#0299EE",
  border: "#5560720f",
  bosonSkyBlue: "#51BEFA",
  cyan: "#00FFFF",
  froly: "#F46A6A",
  green: "#02F3A2",
  grey: "grey",
  greyDark: "#556072",
  greyLight: "#F1F3F9",
  greyLight2: "#dedfe3",
  orange: "#FC6838",
  orangeDark: "darkorange",
  red: "#FC386A",
  redDark: "darkred",
  torquise: "#06F7D5",
  violet: "#7829F9",
  white: "#ffffff"
} as const;

export const theme = {
  blackAndWhite: {
    "--background-color": "#333333",
    "--text-color": "#ffffff"
  },
  dark: {},
  light: {
    "--background-color": "#ffffff",
    "--text-color": "#000000"
  }
} as const;
