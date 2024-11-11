import { ReactNode } from "react";
import {
  ActionMeta,
  CSSObjectWithLabel,
  MultiValue,
  SingleValue
} from "react-select";
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

export interface SelectDataProps<Value = string> {
  label: string;
  value: Value;
  disabled?: boolean;
  [others: string]: unknown;
}

export interface SelectContentProps {
  children: React.ReactNode | JSX.Element;
}

export type OnChange<Value = string> = (
  value: SingleValue<SelectDataProps<Value>>
) => void;

export interface BaseSelectProps<Value = string> {
  options: Array<SelectDataProps<Value>>;
  placeholder?: string;
  defaultValue?: SelectDataProps<Value> | null;
  onChange?: OnChange<Value>;
}

export type SelectProps<
  M extends boolean | undefined = false,
  Value = string
> = BaseProps & {
  isMulti?: M;
  disabled?: boolean;
  isClearable?: boolean;
  isSearchable?: boolean;
  options:
    | Array<SelectDataProps<Value>>
    | Readonly<Array<SelectDataProps<Value>>>;
  errorMessage?: string;
  onChange?: (
    option: M extends true
      ? MultiValue<SelectDataProps<Value>>
      : SingleValue<SelectDataProps<Value>>,
    actionMeta?: ActionMeta<SelectDataProps<Value>>
  ) => void;
  label?: string;
  theme?: Partial<{
    control: Partial<CSSProperties> &
      Partial<{
        hover: Partial<CSSProperties>;
        focus: Partial<CSSProperties>;
        error: Partial<CSSProperties>;
      }>;
    option: Partial<CSSProperties> &
      Partial<{
        selected: Partial<CSSProperties>;
        disabled: Partial<CSSProperties>;
        focus: Partial<CSSProperties>;
        error: Partial<CSSObjectWithLabel>;
      }>;
    placeholder: Partial<CSSProperties> &
      Partial<{ error: CSSObjectWithLabel }>;
    input: Partial<CSSProperties> & Partial<{ error: CSSObjectWithLabel }>;
    singleValue: Partial<CSSProperties> &
      Partial<{ error: CSSObjectWithLabel }>;
  }>;
} & Pick<
    StateManagerProps<
      SelectDataProps<Value>,
      M extends undefined ? false : boolean
    >,
    "formatGroupLabel" | "formatOptionLabel"
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
