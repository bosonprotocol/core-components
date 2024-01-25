import React from "react";
import { ChatDots, CheckCircle } from "phosphor-react";
import styled from "styled-components";
import { useChatContext } from "./ChatProvider/ChatContext";
import { useChatStatus } from "./useChatStatus";
import { Grid } from "../ui/Grid";
import InitializeChat from "./InitializeChat";
import { Typography } from "../ui/Typography";

const CheckIcon = styled(CheckCircle)`
  color: var(--primary);
  path {
    stroke: var(--primary);
  }
`;
const ChatDotsIcon = styled(ChatDots)`
  fill: var(--accent);
  path {
    stroke: var(--accent);
  }
`;

export default function InitializeChatWithSuccess() {
  const { bosonXmtp } = useChatContext();
  const { chatInitializationStatus } = useChatStatus();
  const showInitializeChat = !bosonXmtp || chatInitializationStatus === "ERROR";
  const showSuccessInitialization =
    chatInitializationStatus === "INITIALIZED" && bosonXmtp;
  return (
    <>
      {showInitializeChat && (
        <Grid margin="1.5rem 0">
          <InitializeChat isError={chatInitializationStatus === "ERROR"} />
        </Grid>
      )}
      {showSuccessInitialization && (
        <div>
          <Grid justifyContent="space-between" gap="2rem" margin="1.5rem 0">
            <Grid justifyContent="flex-start" gap="1rem">
              <ChatDotsIcon size={24} />
              <Typography>
                You successfully initialized your chat client
              </Typography>
            </Grid>
            <div>
              <CheckIcon size={24} />
            </div>
          </Grid>
        </div>
      )}
    </>
  );
}
