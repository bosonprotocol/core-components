import { getCssVar } from "../../theme";

export const inputStyles = {
  background: getCssVar("--background-accent-color"),
  color: getCssVar("--main-text-color"),
  placeholder: {
    color: getCssVar("--sub-text-color")
  }
} as const;
