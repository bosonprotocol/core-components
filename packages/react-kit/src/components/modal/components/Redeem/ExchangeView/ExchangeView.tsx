import React from "react";
type Props = {
  onBackClick: () => void;
  onNextClick: () => void;
  isValid: boolean;
};

export function ExchangeView({ onBackClick, onNextClick }: Props) {
  return <p>ExchangeView</p>;
}
