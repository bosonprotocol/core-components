/* eslint-disable @typescript-eslint/no-explicit-any */
import "styled-components";
import { colors } from "@bosonprotocol/utils";
import type { CSSProperties } from "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    // Allow flexible properties to accommodate different component theme types
    colors?: typeof colors | any;
    background?: string | { color?: string; accent?: string } | any;
    backgroundColor?: CSSProperties["backgroundColor"];
    borderColor?: CSSProperties["borderColor"] | string;
    borderRadius?: CSSProperties["borderRadius"] | string | number;
    color?: CSSProperties["color"] | string;

    // SVG properties
    svg?: { fill?: string; stroke?: string };
    fill?: string;
    stroke?: string;

    // State-based properties
    hover?: {
      borderColor?: string;
      background?: string;
      backgroundColor?: string;
      fill?: string;
      stroke?: string;
      color?: string;
    };
    focus?: { borderColor?: string; caretColor?: string };
    error?: {
      borderColor?: string;
      backgroundColor?: string;
      color?: string;
      hover?: {
        borderColor?: string;
        backgroundColor?: string;
        color?: string;
      };
      focus?: { borderColor?: string; caretColor?: string };
      placeholder?: { color?: string };
    };
    checked?: {
      borderColor?: string;
      backgroundColor?: string;
      color?: string;
    };
    placeholder?: { color?: string };

    // Allow any other properties for maximum flexibility
    [key: string]: any;
  }
}
