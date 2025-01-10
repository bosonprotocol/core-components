import { CSSProperties } from "styled-components";
import { IButton } from "../../ui/ThemedButton";

export type CommitButtonViewProps = {
  disabled?: boolean;
  layout?: "vertical" | "horizontal";
  onClick?: IButton["onClick"];
  minWidth?: CSSProperties["minWidth"];
  minHeight?: CSSProperties["minHeight"];
  color?: "green" | "black" | "white";
  shape?: "sharp" | "rounded" | "pill";
};
