import styled, { css } from "styled-components";
import { transition } from "../../global";

const checkIfValueIsEmpty = (v: any) =>
  v == null ||
  (v.hasOwnProperty("length") && v.length === 0) ||
  (v.constructor === Object && Object.keys(v).length === 0);

export const FieldInput = styled.input.attrs((props: { error: boolean }) => ({
  error: props.error
}))`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 1rem;
  gap: 0.5rem;

  background: ${({ theme }) => theme?.colors?.light.lightGrey || "#F1F3F9"};
  border: 1px solid ${({ theme }) => theme?.colors?.light.border || "#5560720f"};
  border-radius: 0;
  outline: none;

  ${transition}

  :not(:disabled) {
    :focus,
    :hover {
      border: 1px solid
        ${({ theme }) => theme?.colors?.light.secondary || "#7829F9"};
    }
  }

  :disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  ${({ error }) =>
    !checkIfValueIsEmpty(error)
      ? css`
          border: 1px solid
            ${({ theme }) => theme?.colors?.light.red || "#FC386A"};
          :not(:disabled) {
            :hover {
              border: 1px solid
                ${({ theme }) => theme?.colors?.light.red || "#FC386A"};
            }
          }
          :not(:disabled) {
            :focus {
              border: 1px solid
                ${({ theme }) => theme?.colors?.light.secondary || "#7829F9"};
            }
          }
        `
      : css`
          :not(:disabled) {
            :focus,
            :hover {
              border: 1px solid
                ${({ theme }) => theme?.colors?.light.secondary || "#7829F9"};
            }
          }
        `}
`;

export const FieldTextArea = styled.textarea.attrs((props: { error: any }) => ({
  error: props.error
}))`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 1rem;
  gap: 0.5rem;

  background: ${({ theme }) => theme?.colors?.light.lightGrey || "#F1F3F9"};
  border: 1px solid ${({ theme }) => theme?.colors?.light.border || "#5560720f"};
  border-radius: 0;
  outline: none;

  ${transition}

  :not(:disabled) {
    :focus,
    :hover {
      border: 1px solid
        ${({ theme }) => theme?.colors?.light.secondary || "#7829F9"};
    }
  }

  :disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  ${({ error }) =>
    !checkIfValueIsEmpty(error)
      ? css`
          border: 1px solid
            ${({ theme }) => theme?.colors?.light.red || "#FC386A"};
          :not(:disabled) {
            :hover {
              border: 1px solid
                ${({ theme }) => theme?.colors?.light.red || "#FC386A"};
            }
          }
          :not(:disabled) {
            :focus {
              border: 1px solid
                ${({ theme }) => theme?.colors?.light.secondary || "#7829F9"};
            }
          }
        `
      : css`
          :not(:disabled) {
            :focus,
            :hover {
              border: 1px solid
                ${({ theme }) => theme?.colors?.light.secondary || "#7829F9"};
            }
          }
        `}
`;
