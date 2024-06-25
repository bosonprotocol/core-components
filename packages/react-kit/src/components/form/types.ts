import { ReactNode } from "react";
import { SingleValue } from "react-select";
import { CSSProperties } from "styled-components";
import { ImageEditorModalProps } from "./Upload/ImageEditorModal/ImageEditorModal";
import type { TextAreaTheme } from "./Field.styles";

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

export interface CheckboxProps extends BaseProps {
  text?: string;
}

export type TextareaProps = BaseProps &
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { theme?: TextAreaTheme };

export interface ErrorProps {
  display?: boolean;
  message?: string;
}

export interface FormFieldProps {
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

export interface SelectDataProps<Value extends string = string> {
  label: string;
  value: Value;
  disabled?: boolean;
  [others: string]: unknown;
}

export interface SelectContentProps {
  children: React.ReactNode | JSX.Element;
}

export type OnChange = (value: SingleValue<SelectDataProps>) => void;

export interface BaseSelectProps {
  options: Array<SelectDataProps>;
  placeholder?: string;
  defaultValue?: SelectDataProps | null;
  onChange?: OnChange;
}

export interface SelectProps extends BaseProps {
  isMulti?: boolean;
  disabled?: boolean;
  isClearable?: boolean;
  isSearchable?: boolean;
  options: Array<SelectDataProps> | Readonly<Array<SelectDataProps>>;
  errorMessage?: string;
  onChange?: (option: SelectDataProps<string>) => void;
  label?: string;
  theme?: Partial<{
    control: Partial<{
      background: CSSProperties["background"];
      borderRadius: CSSProperties["borderRadius"];
      padding: CSSProperties["padding"];
      boxShadow: CSSProperties["boxShadow"];
      borderWidth: CSSProperties["borderWidth"];
      border: CSSProperties["border"];
      focus: Partial<{
        border: CSSProperties["border"];
      }>;
      hover: Partial<{
        borderColor: CSSProperties["borderColor"];
        borderWidth: CSSProperties["borderWidth"];
        border: CSSProperties["border"];
      }>;
      error: Partial<{
        border: CSSProperties["border"];
      }>;
    }>;
    option: Partial<{
      opacity: CSSProperties["opacity"];
      background: CSSProperties["background"];
      color: CSSProperties["color"];
      selected: Partial<{
        background: CSSProperties["background"];
        color: CSSProperties["color"];
      }>;
      disabled: Partial<{
        opacity: CSSProperties["opacity"];
      }>;
    }>;
  }>;
}

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
  width?: number;
  height?: number;
  imgPreviewStyle?: Pick<CSSProperties, "objectFit">;
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
