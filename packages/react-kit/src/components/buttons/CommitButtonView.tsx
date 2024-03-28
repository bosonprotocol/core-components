import React, { forwardRef } from "react";
import { Button } from "./Button";
import Logo from "../../assets/logo.svg";
import styled, { CSSProperties } from "styled-components";
import { IButton } from "../ui/ThemedButton";
import { SvgImage } from "../ui/SvgImage";

const StyledButton = styled(Button)`
  :hover * {
    fill: white;
  }
  svg * {
    fill: black;
  }
`;

const CommitButtonText = {
  BUY_PHYSICAL: "Buy Physical NFT with",
  BUY_REDEEMABLE: "Buy Redeemable with",
  ADD_TO_WALLET: "Add to your wallet"
} as const;

type CommitButtonProps = {
  text: keyof typeof CommitButtonText;
  disabled?: boolean;
  onClick: IButton["onClick"];
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
};

export const CommitButtonView = forwardRef<
  HTMLButtonElement,
  CommitButtonProps
>(({ text, disabled, onClick, width, height }, ref) => {
  return (
    <StyledButton
      disabled={disabled}
      onClick={onClick}
      ref={ref}
      style={{
        minWidth: width,
        height
      }}
    >
      {CommitButtonText[text] || CommitButtonText["BUY_PHYSICAL"]}
      <SvgImage src={Logo} width="100px" height="auto" />
    </StyledButton>
  );
});
