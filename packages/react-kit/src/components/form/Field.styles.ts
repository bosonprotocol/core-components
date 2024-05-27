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
  font-family: "Plus Jakarta Sans";

  ${transition}

  &:not(:disabled) {
    &:focus,
    &:hover {
      border: 1px solid
        ${(props) => props.theme?.hover?.borderColor || colors.lightGrey};
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
              props.theme?.error?.focus?.borderColor || colors.lightGrey};
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

export const FileUploadWrapper = styled.div<{ choosen: any; error: any }>`
  position: relative;
  overflow: hidden;
  display: flex;

  align-items: center;
  justify-content: center;
  flex-direction: column;

  padding: 0.5rem;

  width: 8rem;
  height: 8rem;

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

  background: ${colors.lightGrey};
  border-radius: 0;
  outline: none;

  ${({ error }) =>
    !checkIfValueIsEmpty(error)
      ? css`
          border: 1px solid ${colors.orange};
        `
      : css`
          border: 1px solid ${colors.border};
        `}

  ${transition};

  &:focus,
  &:hover {
    border: 1px solid var(--secondary);
  }

  /* prettier-ignore */
  [data-disabled=true] {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export const FieldFileUpload = styled(FieldInput)`
  display: none;
`;

export const FieldFileUploadWrapper = styled.div<{ $disabled: boolean }>`
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

  width: 8rem;

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

export const FieldTextArea = styled.textarea<{ error: any }>`
  width: 100%;
  padding: 1rem;
  gap: 0.5rem;
  font-family: "Plus Jakarta Sans";

  background: ${colors.lightGrey};
  border: 1px solid ${colors.border};
  border-radius: 0;
  outline: none;

  ${transition}

  &:not(:disabled) {
    &:focus,
    &:hover {
      border: 1px solid var(--secondary);
    }
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  ${({ error }) =>
    !checkIfValueIsEmpty(error)
      ? css`
          border: 1px solid ${colors.orange};
          &::placeholder {
            color: ${colors.orange};
            opacity: 1;
          }
          &:-ms-input-placeholder {
            color: ${colors.orange};
          }
          &::-ms-input-placeholder {
            color: ${colors.orange};
          }
          &:not(:disabled) {
            &:hover {
              border: 1px solid ${colors.orange};
            }
          }
          &:not(:disabled) {
            &:focus {
              border: 1px solid var(--secondary);
            }
          }
        `
      : css`
          &:not(:disabled) {
            &:focus,
            &:hover {
              border: 1px solid var(--secondary);
            }
          }
        `}
`;

export const FormFieldWrapper = styled(Grid)`
  margin-bottom: 3.5rem;
  p {
    line-height: 150%;
  }

  // theme white
  margin-bottom: 0.5rem;
  input,
  textarea {
    background: ${colors.white};
    &:disabled {
      opacity: 1;
    }
  }
  input {
    border-width: 0;
    &:hover {
      border-width: 0;
    }
  }
  input + div {
    background: ${colors.white};
  }
  // end theme white

  [data-header] {
    margin: 0;
    font-weight: 600;
    font-size: 1rem;
    color: ${colors.black};
    + div button {
      margin-left: 0.5rem;
      padding: 0;
    }
  }
  [data-subheader] {
    margin: 0;
    font-weight: 400;
    font-size: 0.75rem;
    color: ${colors.darkGrey};
  }
`;

export const CheckboxWrapper = styled.label<{ error: any }>`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;

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
          border: 1px solid ${colors.secondary};
          svg {
            opacity: 0.25;
          }
        }
      }
    }
  }

  > div,
  > div svg {
    ${transition}
  }
  > div {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 1.5rem;

    background: ${colors.lightGrey};

    margin-right: 0.5rem;
  }

  > input {
    &:checked {
      + div svg {
        opacity: 1;
      }
    }
    &:not(:checked) {
      + div svg {
        opacity: 0;
      }
    }
  }

  ${({ error }) =>
    !checkIfValueIsEmpty(error)
      ? css`
          > div {
            border: 1px solid ${colors.orange};
          }
        `
      : css`
          > div {
            border: 1px solid ${colors.border};
          }
        `}
`;

export const VideoPreview = styled.video`
  background: ${colors.lightGrey};
  height: 100%;
  width: 100%;
  object-fit: contain;
`;
export const ImagePreview = styled.img`
  background: ${colors.lightGrey};
`;
