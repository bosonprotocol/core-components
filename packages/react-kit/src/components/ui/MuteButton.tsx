import { SpeakerSimpleHigh, SpeakerSimpleSlash } from "phosphor-react";
import React from "react";
import styled from "styled-components";

const Wrapper = styled.button`
  > svg {
    filter: drop-shadow(1px 1px 0px white);
  }
`;

type MuteButtonProps = {
  muted: boolean;
  onClick: () => void;
  className?: string;
};

export const MuteButton: React.FC<MuteButtonProps> = ({
  muted,
  onClick,
  className
}) => {
  return (
    <Wrapper onClick={onClick} className={className}>
      {muted ? (
        <SpeakerSimpleSlash size={20} />
      ) : (
        <SpeakerSimpleHigh size={20} />
      )}
    </Wrapper>
  );
};
