import React from "react";
import styled, { CSSProperties, css } from "styled-components";

import { useToggleAccountDrawer } from "../accountDrawer";
import { flexColumnNoWrap, flexRowNoWrap } from "../styles";
import { Connection } from "../../connection/types";
import { useChainId } from "../../../hooks/connection/connection";
import {
  ActivationStatus,
  useActivationState
} from "../../connection/activate";
import { theme } from "../../../theme";
import { breakpoint } from "../../../lib/ui/breakpoint";
import { Spinner } from "../../ui/loading/Spinner";
import { SvgImage } from "../../ui/SvgImage";

const colors = theme.colors.light;
const OptionCardLeft = styled.div`
  ${flexColumnNoWrap};
  flex-direction: row;
  align-items: center;
`;

const OptionCardClickable = styled.button<{ selected: boolean }>`
  align-items: center;
  background-color: unset;
  border: none;
  cursor: pointer;
  display: flex;
  flex: 1 1 auto;
  flex-direction: row;
  justify-content: space-between;
  opacity: ${({ disabled, selected }) => (disabled && !selected ? "0.5" : "1")};
  padding: 18px;
  transition: 125ms;
  ${({ disabled }) =>
    disabled &&
    css`
      cursor: not-allowed;
    `};
`;

const HeaderText = styled.div<{ $color: CSSProperties["color"] }>`
  ${flexRowNoWrap};
  align-items: center;
  justify-content: center;
  color: ${({ $color }) => $color};
  font-size: 1rem;
  font-weight: 600;
  padding: 0 8px;
`;
const IconWrapper = styled.div<{
  $borderRadius: CSSProperties["borderRadius"];
}>`
  ${flexColumnNoWrap};
  align-items: center;
  justify-content: center;
  img,
  svg {
    border: 1px solid ${colors.border};
    border-radius: ${({ $borderRadius }) => $borderRadius};
  }
  & > img,
  & > svg,
  span {
    height: 40px;
    width: 40px;
  }
  ${breakpoint.m} {
    align-items: flex-end;
  }
`;

const Wrapper = styled.div<{
  disabled: boolean;
  $hoverFocusBackgroundColor: CSSProperties["backgroundColor"];
  $hoverColor: CSSProperties["color"];
  $backgroundColor: CSSProperties["backgroundColor"];
}>`
  align-items: stretch;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  position: relative;
  width: 100%;

  background-color: ${({ $backgroundColor }) => $backgroundColor};

  &:hover {
    cursor: ${({ disabled }) => !disabled && "pointer"};
    background-color: ${({ disabled, $hoverFocusBackgroundColor }) =>
      !disabled && $hoverFocusBackgroundColor};
    ${HeaderText} {
      color: ${({ disabled, $hoverColor }) => !disabled && $hoverColor};
    }
  }
  &:focus {
    background-color: ${({ disabled, $hoverFocusBackgroundColor }) =>
      !disabled && $hoverFocusBackgroundColor};
    ${HeaderText} {
      color: ${({ disabled, $hoverColor }) => !disabled && $hoverColor};
    }
  }
`;

export interface OptionProps {
  connection: Connection;
  color: CSSProperties["color"];
  hoverFocusBackgroundColor: CSSProperties["backgroundColor"];
  hoverColor: CSSProperties["color"];
  backgroundColor: CSSProperties["backgroundColor"];
  borderRadius: CSSProperties["borderRadius"];
}
export function Option({
  connection,
  color,
  hoverFocusBackgroundColor,
  hoverColor,
  backgroundColor,
  borderRadius
}: OptionProps) {
  const { activationState, tryActivation } = useActivationState();
  const toggleAccountDrawer = useToggleAccountDrawer();
  const chainId = useChainId();
  const activate = () =>
    tryActivation(connection, toggleAccountDrawer, chainId);

  const isSomeOptionPending =
    activationState.status === ActivationStatus.PENDING;
  const isCurrentOptionPending =
    isSomeOptionPending && activationState.connection.type === connection.type;

  return (
    <Wrapper
      disabled={isSomeOptionPending}
      $hoverFocusBackgroundColor={hoverFocusBackgroundColor}
      $hoverColor={hoverColor}
      $backgroundColor={backgroundColor}
    >
      <OptionCardClickable
        disabled={isSomeOptionPending}
        onClick={activate}
        selected={isCurrentOptionPending}
        data-testid={`wallet-option-${connection.type}`}
      >
        <OptionCardLeft>
          <IconWrapper $borderRadius={borderRadius}>
            <SvgImage
              src={connection.getIcon?.(false)}
              alt={connection.getName()}
            />
          </IconWrapper>
          <HeaderText $color={color}>{connection.getName()}</HeaderText>
        </OptionCardLeft>
        {isCurrentOptionPending && <Spinner />}
      </OptionCardClickable>
    </Wrapper>
  );
}
