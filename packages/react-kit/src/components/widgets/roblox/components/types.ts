import { BaseButtonTheme } from "../../../buttons/BaseButton";

export type ButtonThemeProps = {
  active: Omit<BaseButtonTheme, "color" | "background"> &
    Required<Pick<BaseButtonTheme, "color" | "background">>;
  inactive: Omit<BaseButtonTheme, "color" | "background"> &
    Required<Pick<BaseButtonTheme, "color" | "background">>;
};
