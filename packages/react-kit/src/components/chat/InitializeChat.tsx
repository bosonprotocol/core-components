import React from "react";
import { ChatDots, Warning } from "phosphor-react";
import styled from "styled-components";
import { useAccount } from "hooks/connection/connection";
import Grid from "../ui/Grid";
import ThemedButton from "../ui/ThemedButton";
import Typography from "../ui/Typography";
import { Spinner } from "../ui/loading/Spinner";
import ConnectButton from "../wallet/ConnectButton";
import { theme } from "../../theme";
import { useChatContext } from "./ChatProvider/ChatContext";

const colors = theme.colors.light;
const Info = styled(Grid)`
  display: flex;
  justify-content: space-between;
  background-color: ${colors.lightGrey};
  padding: 1.5rem;
`;

const Icon = styled(ChatDots)`
  fill: var(--accent);
  path {
    stroke: var(--accent);
  }
`;

const IconError = styled(Warning)`
  color: ${colors.froly};
`;

interface Props {
  isError?: boolean;
}
export default function InitializeChat({ isError = false }: Props) {
  const { initialize, bosonXmtp, isInitializing } = useChatContext();
  const { address } = useAccount();

  const isInitializeButtonVisible =
    (address && !bosonXmtp) || (isError && address && !bosonXmtp);

  return (
    <Info justifyContent="space-between" gap="2rem">
      <Grid justifyContent="flex-start" gap="1rem">
        {isError ? <IconError size={24} /> : <Icon size={24} />}
        <Typography
          $fontSize="1rem"
          fontWeight="600"
          lineHeight="1.5rem"
          flex="1 1"
          letterSpacing="0"
          text-align="left"
        >
          {isError
            ? `Chat initialization failed, please try again`
            : `To proceed you must first initialize your chat client`}
        </Typography>
      </Grid>
      <div>
        {isInitializeButtonVisible ? (
          <ThemedButton
            type="button"
            theme="accentFill"
            style={{
              color: colors.white
            }}
            disabled={isInitializing}
            onClick={() => {
              initialize();
            }}
          >
            {isInitializing ? (
              <>
                Initializing
                <Spinner />
              </>
            ) : (
              <>Initialize</>
            )}
          </ThemedButton>
        ) : !address ? (
          <ConnectButton />
        ) : null}
      </div>
    </Info>
  );
}
