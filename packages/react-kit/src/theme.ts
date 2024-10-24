import "styled-components";

export const theme = {
  colors: {
    light: {
      primary: "#02F3A2",
      secondary: "#7829F9",
      accent: "#7829F9",
      black: "#09182C",
      lightGrey: "#F1F3F9",
      darkGrey: "#556072",
      white: "#ffffff",
      green: "#02F3A2",
      red: "#FC386A",
      blue: "#0299EE",
      orange: "#FC6838",
      lime: "#B6F952",
      torquise: "#06F7D5",
      border: "#5560720f",
      arsenic: "#3a364f",
      primaryBgColor: "#FFFFFF",
      darkOrange: "darkorange",
      froly: "#F46A6A",
      bosonSkyBlue: "#51BEFA",
      navy: "#222539",
      grey2: "#D3D5DB",
      grey: "grey",
      grey3: "#A1A1A1",
      darkRed: "darkred",
      cyan: "#00FFFF",
      lightArrowColor: "#dedfe3",
      darkGreyTimeStamp: "#E8EAF1",
      lightGrey2: "#eff0f7"
    }
  },
  borders: {
    // in px
    small: 8,
    medium: 12,
    big: 16,
    large: 32
  } as const,
  mobile: "768px",
  tablet: "1024px",
  transition: {
    time: "150ms",
    timing: "ease-in-out"
  }
} as const;
