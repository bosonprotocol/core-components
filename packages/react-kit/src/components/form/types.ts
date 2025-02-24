import { ReactNode } from "react";
import { SingleValue } from "react-select";
import { CSSProperties } from "styled-components";
import { ImageEditorModalProps } from "./Upload/ImageEditorModal/ImageEditorModal";
import type {
  CheckboxTheme,
  FileUploadWrapperTheme,
  TextAreaTheme
} from "./Field.styles";
import type { GridProps } from "../ui/Grid";
import { StateManagerProps } from "react-select/dist/declarations/src/useStateManager";
import { IconProps } from "phosphor-react";

export interface BaseProps {
  name: string;
  placeholder?: string;
  disabled?: boolean;
  hideError?: boolean;
}

export interface DatepickerProps extends BaseProps {
  data?: string;
  period?: boolean;
  selectTime?: boolean;
  setIsFormValid?: (isValid: boolean) => void;
}

export type CheckboxProps = BaseProps &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "checked"> & {
    text?: string;
    className?: string;
    theme?: CheckboxTheme;
    iconProps?: Parameters<
      React.ForwardRefExoticComponent<
        IconProps & React.RefAttributes<SVGSVGElement>
      >
    >[0];
  };

export type TextareaProps = BaseProps &
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { theme?: TextAreaTheme };

export interface ErrorProps {
  display?: boolean;
  message?: string;
}

export interface FormFieldProps extends GridProps {
  title: string;
  titleIcon?: ReactNode;
  subTitle?: string | false;
  required?: boolean;
  tooltip?: string;
  children: React.ReactNode | string;
  style?: React.CSSProperties;
  copyIconColor?: CSSProperties["backgroundColor"];
  valueToCopy?:
    | string
    | {
        [key: string]: unknown;
      };
}

export type InputColorProps = BaseProps;

export type InputProps = BaseProps &
  React.InputHTMLAttributes<HTMLInputElement>;

export type TagsProps = BaseProps &
  React.InputHTMLAttributes<HTMLInputElement> & {
    onAddTag?: (tag: string) => void;
    onRemoveTag?: (tag: string) => void;
    label?: string;
    compareTags?: (tagA: string, tagB: string) => boolean;
    transform?: (tag: string) => string;
  };

export interface SelectDataProps<Value = string, Label = string> {
  label: Label;
  value: Value;
  disabled?: boolean;
  [others: string]: unknown;
}

export interface SelectContentProps {
  children: React.ReactNode | JSX.Element;
}

export type OnChange<Value = string, Label = string> = (
  value: SingleValue<SelectDataProps<Value, Label>>
) => void;

export interface BaseSelectProps<Value = string, Label = string> {
  options: Array<SelectDataProps<Value, Label>>;
  placeholder?: string;
  defaultValue?: SelectDataProps<Value, Label> | null;
  onChange?: OnChange<Value, Label>;
  hasError?: boolean;
}
export type SupportedReactSelectProps<
  M extends boolean | undefined = false,
  Option extends Record<string, unknown> = SelectDataProps
> = Pick<
  StateManagerProps<Option, M extends undefined ? false : boolean>,
  // | "formatOptionLabel"
  | "menuPlacement"
  | "menuPosition"
  | "menuIsOpen"
  | "menuPortalTarget"
  | "onMenuClose"
  | "onMenuOpen"
  | "onMenuScrollToBottom"
  | "onMenuScrollToTop"
  | "maxMenuHeight"
  | "minMenuHeight"
  | "menuShouldBlockScroll"
  | "menuShouldScrollIntoView"
  | "openMenuOnClick"
  | "openMenuOnFocus"
  | "closeMenuOnScroll"
  | "closeMenuOnSelect"
  | "captureMenuScroll"
  | "defaultMenuIsOpen"
  | "placeholder"
  | "hideSelectedOptions"
>;

export type UploadProps = BaseProps & {
  accept?: string;
  multiple?: boolean;
  trigger?: React.ReactNode | JSX.Element;
  maxSize?: number;
  onFilesSelect?: (files: UploadFileType[]) => void;
  files?: File[];
  wrapperProps?: React.HTMLAttributes<HTMLDivElement>;
  onLoadSinglePreviewImage?: (base64Uri: string) => void;
  withUpload?: boolean;
  onLoading?: (loading: boolean) => void;
  borderRadius?: number;
  borderRadiusUnit?: "px" | "%";
  width?: number;
  height?: number;
  errorComponent?: (errorMessage: string) => React.ReactNode;
  imgPreviewStyle?: Pick<CSSProperties, "objectFit">;
  theme?: Partial<{
    triggerTheme: FileUploadWrapperTheme;
    overrides: React.CSSProperties;
    uploadButton: React.CSSProperties;
  }>;
} & (
    | {
        withEditor: true;
        saveButtonTheme: ImageEditorModalProps["saveButtonTheme"];
      }
    | { withEditor: false; saveButtonTheme: undefined }
  );

export interface FileProps {
  src: string;
  name?: string; // for example: "redeemeum.png"
  size?: number;
  type?: string; // for example: "image/png"
  width?: number;
  height?: number;
}
export type UploadFileType = File | FileProps;
