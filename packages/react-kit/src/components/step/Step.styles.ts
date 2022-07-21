import { StepState } from "./Step";
import styled, { css } from "styled-components";

export const StepStyle = styled.div.attrs((props: { state: StepState }) => ({
  state: props.state
}))`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-grow: 1;

  min-width: 6rem;
  height: 1.25rem;
  ${({ state }) =>
    state !== StepState.Active &&
    css`
      :hover {
        cursor: pointer;
      }
    `}

  ${({ state }) =>
    state === StepState.Inactive &&
    css`
      background: ${({ theme }) => theme?.colors?.light.white};
      transition: all ${({ theme }) => theme?.transition?.time || "150ms"}
        ${({ theme }) => theme?.transition?.timing || "ease-in-out"};

      :before {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        transition: all ${({ theme }) => theme?.transition?.time || "150ms"}
          ${({ theme }) => theme?.transition?.timing || "ease-in-out"};
        border-radius: 50%;
        background: #d3d5db;

        width: 0.25rem;
        height: 0.25rem;
      }

      :hover {
        background: ${({ theme }) => theme?.colors?.light.lightGrey};
        :before {
          background: ${({ theme }) => theme?.colors?.light.darkGrey};
          width: 0.5rem;
          height: 0.5rem;
        }
      }

      > div {
        display: none;
      }
    `}

  ${({ state }) =>
    state === StepState.Active &&
    css`
      background: ${({ theme }) => theme?.colors?.light.black};

      :before {
        margin-left: -0.75rem;
      }
      :after {
        margin-left: 0.75rem;
      }
      > div,
      :before,
      :after {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        transition: all ${({ theme }) => theme?.transition?.time || "150ms"}
          ${({ theme }) => theme?.transition?.timing || "ease-in-out"};
        width: 0.25rem;
        height: 0.25rem;
        border-radius: 50%;
        background: ${({ theme }) => theme?.colors?.light.primary};
      }
    `}

  ${({ state }) =>
    state === StepState.Done &&
    css`
      background: ${({ theme }) => theme?.colors?.light.primary};

      :before,
      :after {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        transition: all ${({ theme }) => theme?.transition?.time || "150ms"}
          ${({ theme }) => theme?.transition?.timing || "ease-in-out"};
        background: ${({ theme }) => theme?.colors?.light.black};
      }
      :before {
        width: 0.35rem;
        height: 0.125rem;
        transform: translate(calc(-50% - 0.35rem), calc(-50% + 0.15rem))
          rotate(-135deg);
      }
      :after {
        width: 0.75rem;
        height: 0.125rem;
        transform: translate(-50%, -50%) rotate(-45deg);
      }

      > div {
        display: none;
      }

      :hover {
        background: ${({ theme }) => theme?.colors?.light.black};
        :before,
        :after {
          background: ${({ theme }) => theme?.colors?.light.primary};
        }
      }
    `}
`;

export const MultiStepStyle = styled.div`
  display: flex;
  gap: 1rem;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;

  align-items: center;
  p {
    text-align: center;
    margin: 0;
    font-weight: 600;
    font-size: 12px;
    line-height: 200%;
    color: ${({ theme }) => theme?.colors?.light.darkGrey};
  }
`;

export const MultiStepWrapper = styled.div`
  display: flex;
  flex-grow: 1;

  flex-direction: column;
`;

export const StepWrapper = styled.div`
  display: flex;
  gap: 0;
  flex-grow: 1;

  flex-direction: row;
  flex-wrap: nowrap;

  border: 1px solid ${({ theme }) => theme?.colors?.light.border};
`;
