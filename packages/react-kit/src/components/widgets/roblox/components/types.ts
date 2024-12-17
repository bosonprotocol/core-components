import { CSSProperties } from "styled-components";
import { BaseButtonTheme } from "../../../buttons/BaseButton";

export type CardThemeProps = {
  title: {
    color: CSSProperties["color"];
  };
  subtitle: {
    color: CSSProperties["color"];
  };
  check: {
    color: CSSProperties["color"];
  };
  number: {
    active: {
      backgroundColor: CSSProperties["color"];
      stroke: CSSProperties["color"];
    };
    inactive: {
      backgroundColor: CSSProperties["color"];
      stroke: CSSProperties["color"];
    };
  };
  button: ButtonThemeProps;
};

export type ButtonThemeProps = {
  active: Omit<BaseButtonTheme, "color" | "background"> &
    Required<Pick<BaseButtonTheme, "color" | "background">>;
  inactive: Omit<BaseButtonTheme, "color" | "background"> &
    Required<Pick<BaseButtonTheme, "color" | "background">>;
};
