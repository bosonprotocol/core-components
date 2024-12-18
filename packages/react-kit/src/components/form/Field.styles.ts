/* eslint @typescript-eslint/no-explicit-any: "off" */
import styled, { CSSProperties, css } from "styled-components";

import { transition } from "../../components/ui/styles";
import { checkIfValueIsEmpty } from "../../lib/object/checkIfValueIsEmpty";
import { theme } from "../../theme";
import { Grid } from "../ui/Grid";

const colors = theme.colors.light;

export const CopyButton = styled.button`
  background: none;
  border: none;
`;
export type InputTheme = {
  background: CSSProperties["backgroundColor"];
  borderColor: CSSProperties["borderColor"];
  borderRadius: CSSProperties["borderRadius"];
  focus: {
    caretColor: CSSProperties["caretColor"];
  };
  hover: {
    borderColor: CSSProperties["borderColor"];
  };
  error: {
    borderColor: CSSProperties["borderColor"];
    hover: {
      borderColor: CSSProperties["borderColor"];
    };
    focus: {
      borderColor: CSSProperties["borderColor"];
      caretColor: CSSProperties["caretColor"];
    };
    placeholder: {
      color: CSSProperties["color"];
    };
  };
};
export type HeightSize = keyof typeof sizeToHeight;
const sizeToHeight = {
  small: "40px",
  regular: "49px",
  large: "56px"
} as const;
export const FieldInput = styled.input<{
  $error?: any;
  $heightSize?: HeightSize;
  theme?: InputTheme;
}>`
  box-sizing: border-box;
  ${({ $heightSize }) =>
    $heightSize &&
    css`
      height: ${sizeToHeight[$heightSize]};
    `};
  width: 100%;
  padding: 1rem;
  gap: 0.5rem;

  background: ${(props) => props.theme?.background || "transparent"};
  border: 1px solid ${(props) => props.theme?.borderColor || colors.border};
  border-radius: ${(props) => props.theme?.borderRadius || 0}px;
  outline: none;

  ${transition}

  &:not(:disabled) {
    &:focus,
    &:hover {
      border: 1px solid
        ${(props) => props.theme?.hover?.borderColor || colors.greyLight};
      caret-color: ${(props) => props.theme?.focus?.caretColor || "initial"};
    }
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  ${({ $error }) =>
    !checkIfValueIsEmpty($error) &&
    css`
      border: 1px solid
        ${(props) => props.theme?.error?.borderColor || colors.orange};
      &:not(:disabled) {
        &:hover {
          border: 1px solid
            ${(props) =>
              props.theme?.error?.hover?.borderColor || colors.orange};
        }
      }
      &:not(:disabled) {
        &:focus {
          border: 1px solid
            ${(props) =>
              props.theme?.error?.focus?.borderColor || colors.greyLight};
          caret-color: ${(props) =>
            props.theme?.error?.focus?.caretColor || colors.orange};
        }
      }
      &::placeholder {
        color: ${(props) =>
          props.theme?.error?.placeholder?.color || colors.orange};
        opacity: 1;
      }
      &:-ms-input-placeholder {
        color: ${(props) =>
          props.theme?.error?.placeholder?.color || colors.orange};
      }
      &::-ms-input-placeholder {
        color: ${(props) =>
          props.theme?.error?.placeholder?.color || colors.orange};
      }
    `};
`;

export type FileUploadWrapperTheme = Partial<{
  borderColor: CSSProperties["borderColor"];
  borderRadius: CSSProperties["borderRadius"];
  background: CSSProperties["background"];
  focus: Partial<{
    borderColor: CSSProperties["borderColor"];
  }>;
  error: Partial<{
    borderColor: CSSProperties["borderColor"];
  }>;
  overrides: Partial<CSSProperties>;
}>;
export const FileUploadWrapper = styled.div<{
  $error: unknown;
  $isPdfOnly?: boolean;
  theme: FileUploadWrapperTheme | undefined;
}>`
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  padding: 0.5rem;
  align-items: center;

  ${({ $isPdfOnly }) =>
    $isPdfOnly
      ? css`
          width: 100%;
          flex-direction: row;
          cursor: default;
        `
      : css`
          width: 8rem;
          height: 8rem;
          flex-direction: column;
        `}

  img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: all 300ms ease-in-out;
    pointer-events: none;
    width: 100%;
    height: 100%;
    object-fit: cover;
    + svg {
      display: none;
    }
  }

  background: ${({ theme }) => theme?.background || colors.greyLight};
  ${({ theme }) =>
    theme.borderRadius !== undefined &&
    css`
      border-radius: ${theme.borderRadius};
    `};
  outline: none;

  ${({ $error, theme }) =>
    !checkIfValueIsEmpty($error)
      ? css`
          border: 1px solid ${theme?.error?.borderColor || colors.orange};
        `
      : css`
          border: 1px solid ${theme?.borderColor || colors.border};
        `}

  ${transition};

  &:focus,
  &:hover {
    border: 1px solid
      ${({ theme }) => theme?.hover?.borderColor || colors.greyLight};
  }

  /* prettier-ignore */
  :disabled, [data-disabled=true] {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export const FieldFileUpload = styled(FieldInput)`
  display: none;
`;

export const PdfOnlyLabel = styled.label<{ $disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1rem;
  gap: 0.25rem;
  padding: 0.656rem 1.25rem;
  background: ${colors.greyLight};
  font-size: 0.875rem;
  ${({ $disabled }) =>
    $disabled
      ? css`
          cursor: not-allowed;
        `
      : css`
          cursor: pointer;
        `}
`;

export const FieldFileUploadWrapper = styled.div<{
  $disabled: boolean;
  $isPdfOnly?: boolean;
}>`
  position: relative;
  display: inline-block;
  ${({ $disabled }) =>
    $disabled
      ? css`
          cursor: not-allowed;
        `
      : css`
          cursor: pointer;
        `}

  ${({ $isPdfOnly }) =>
    !$isPdfOnly &&
    css`
      width: 8rem;
    `}

  &:hover {
    [data-remove] {
      display: flex;
    }
  }
  [data-remove] {
    display: none;
    align-items: center;
    justify-content: center;
    width: 8rem;
    height: 8rem;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: all 300ms ease-in-out;

    background: ${colors.black}80;
  }
`;
export type TextAreaTheme = {
  background: CSSProperties["backgroundColor"];
  borderColor: CSSProperties["borderColor"];
  borderRadius: CSSProperties["borderRadius"];
  focus: {
    caretColor: CSSProperties["caretColor"];
  };
  hover: {
    borderColor: CSSProperties["borderColor"];
  };
  error: {
    borderColor: CSSProperties["borderColor"];
    hover: {
      borderColor: CSSProperties["borderColor"];
    };
    focus: {
      borderColor: CSSProperties["borderColor"];
      caretColor: CSSProperties["caretColor"];
    };
    placeholder: {
      color: CSSProperties["color"];
    };
  };
};
export const FieldTextArea = styled.textarea<{ $error: any }>`
  width: 100%;
  padding: 1rem;
  gap: 0.5rem;
  font-family: inherit;
  background: ${(props) => props.theme?.background || "transparent"};
  border: 1px solid ${(props) => props.theme?.borderColor || colors.border};
  border-radius: ${(props) => props.theme?.borderRadius || 0}px;
  outline: none;

  ${transition}

  &:not(:disabled) {
    &:focus,
    &:hover {
      border: 1px solid
        ${(props) => props.theme?.hover?.borderColor || colors.greyLight};
      caret-color: ${(props) => props.theme?.focus?.caretColor || "initial"};
    }
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  ${({ $error }) =>
    !checkIfValueIsEmpty($error) &&
    css`
      border: 1px solid
        ${(props) => props.theme?.error?.borderColor || colors.orange};
      &:not(:disabled) {
        &:hover {
          border: 1px solid
            ${(props) =>
              props.theme?.error?.hover?.borderColor || colors.orange};
        }
      }
      &:not(:disabled) {
        &:focus {
          border: 1px solid
            ${(props) =>
              props.theme?.error?.focus?.borderColor || colors.greyLight};
          caret-color: ${(props) =>
            props.theme?.error?.focus?.caretColor || colors.orange};
        }
      }
      &::placeholder {
        color: ${(props) =>
          props.theme?.error?.placeholder?.color || colors.orange};
        opacity: 1;
      }
      &:-ms-input-placeholder {
        color: ${(props) =>
          props.theme?.error?.placeholder?.color || colors.orange};
      }
      &::-ms-input-placeholder {
        color: ${(props) =>
          props.theme?.error?.placeholder?.color || colors.orange};
      }
    `}
`;

export const FormFieldWrapper = styled(Grid)`
  margin-bottom: 3.5rem;
  p {
    line-height: 150%;
  }

  [data-header] {
    margin: 0;
    font-weight: 600;
    font-size: 1rem;
    + div button {
      margin-left: 0.5rem;
      padding: 0;
    }
  }
  [data-subheader] {
    margin: 0;
    font-weight: 400;
    font-size: 0.75rem;
    color: ${colors.greyDark};
  }
`;

export type CheckboxTheme = Partial<{
  backgroundColor: CSSProperties["backgroundColor"];
  borderColor: CSSProperties["borderColor"];
  borderRadius: CSSProperties["borderRadius"];
  color: CSSProperties["color"];
  hover: Partial<{
    borderColor: CSSProperties["borderColor"];
    backgroundColor: CSSProperties["backgroundColor"];
    color: CSSProperties["color"];
  }>;
  error: Partial<{
    borderColor: CSSProperties["borderColor"];
    backgroundColor: CSSProperties["backgroundColor"];
    color: CSSProperties["color"];
  }>;
  checked: Partial<{
    borderColor: CSSProperties["borderColor"];
    backgroundColor: CSSProperties["backgroundColor"];
    color: CSSProperties["color"];
  }>;
}>;
export const CheckboxWrapper = styled.label<{
  $error: unknown;
  theme: CheckboxTheme;
}>`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;
  gap: 0.5rem;

  > input {
    &:disabled {
      + div {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
    &:not(:disabled) {
      + div {
        cursor: pointer;
        &:hover {
          border: 1px solid
            ${({ theme }) => theme?.hover?.borderColor || colors.border};
          ${({ theme }) =>
            theme?.hover?.backgroundColor &&
            css`
              background-color: ${theme?.hover?.backgroundColor};
            `};
          ${({ theme }) =>
            theme?.hover?.color &&
            css`
              color: ${theme?.hover?.color};
            `};
          svg {
            opacity: 0.25;
          }
        }
      }
    }
  }

  > div:first-of-type,
  > div:first-of-type svg {
    ${transition}
  }
  > div:first-of-type {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 1.5rem;

    background-color: ${({ theme }) =>
      theme?.backgroundColor || colors.greyLight};
    border: 1px solid ${({ theme }) => theme?.borderColor};
    ${({ theme }) =>
      theme?.color &&
      css`
        color: ${theme?.color};
      `};
    ${({ theme }) =>
      theme?.borderRadius !== undefined &&
      css`
        border-radius: ${theme?.borderRadius};
      `};
  }

  > input {
    &:checked {
      + div svg {
        opacity: 1;
      }
      + div {
        ${({ theme }) =>
          theme?.checked?.backgroundColor &&
          css`
            background-color: ${theme?.checked?.backgroundColor};
          `};
        ${({ theme }) =>
          theme?.checked?.borderColor &&
          css`
            border: 1px solid ${theme?.checked?.borderColor};
          `};
        ${({ theme }) =>
          theme?.checked?.color &&
          css`
            color: ${theme?.checked?.color};
          `};
      }
    }
    &:not(:checked) {
      + div svg {
        opacity: 0;
      }
    }
  }

  ${({ $error, theme }) =>
    !checkIfValueIsEmpty($error) &&
    css`
      > div:first-of-type {
        border: 1px solid ${theme?.error?.borderColor || colors.orange}};
        ${
          theme?.error?.backgroundColor &&
          css`
            background-color: ${theme?.error?.backgroundColor};
          `
        };
        ${
          theme?.error?.color &&
          css`
            color: ${theme?.error?.color};
          `
        };
      }
        `}
`;

export const VideoPreview = styled.video`
  background: ${colors.greyLight};
  height: 100%;
  width: 100%;
  object-fit: contain;
`;
export const ImagePreview = styled.img`
  background: ${colors.greyLight};
`;
