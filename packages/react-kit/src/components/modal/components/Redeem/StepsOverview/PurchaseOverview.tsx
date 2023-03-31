import React from "react";
import {
  CaretRight,
  CurrencyCircleDollar,
  Package,
  ShoppingCart
} from "phosphor-react";
import { useBreakpoints } from "../../../../../hooks/useBreakpoints";
import Grid from "../../../../ui/Grid";
import Typography from "../../../../ui/Typography";
import {
  LearnMore,
  ModalBackground
} from "../exchangeView/detail/Detail.style";
import { CommitStep } from "./style";
import styled from "styled-components";
import { breakpoint } from "../../../../../lib/ui/breakpoint";

const CommitStepWrapper = styled.div`
  overflow: hidden;
  margin: 1rem 0;
  display: grid;
  grid-template-columns: 1fr;
  justify-content: space-between;

  grid-template-columns: repeat(1, minmax(0, 1fr));
  grid-row-gap: 1rem;
  grid-column-gap: 1rem;
  ${breakpoint.m} {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  svg {
    fill: var(--secondary);
  }
`;

const COMMIT_STEPS = [
  {
    icon: ShoppingCart,
    header: "Commit",
    description:
      "Commit to an Offer to receive a Redeemable NFT (rNFT) that can be exchanged for the real-world item it represents"
  },
  {
    icon: CurrencyCircleDollar,
    header: "Hold, Trade or Transfer ",
    description:
      "You can  hold, transfer or easily trade your rNFT on the secondary market"
  },
  {
    icon: Package,
    header: "Redeem",
    description:
      "Redeem your rNFT to receive the underlying item. The rNFT will be destroyed in the process."
  }
];

export default function PurchaseOverview() {
  const { isLteXS } = useBreakpoints();

  return (
    <>
      <Grid flexDirection="column" alignItems="flex-start">
        <Typography tag="h4" style={{ margin: 0 }}>
          <b>How does the purchase process work?</b>
        </Typography>
        <Typography tag="p">
          When Committing, the item price will be transferred into escrow and
          you will receive a redeemable NFT (rNFT) that can be exchanged for the
          real-world item it represents.
        </Typography>
      </Grid>
      <CommitStepWrapper>
        {COMMIT_STEPS.map(({ icon: Icon, header, description }, key) => (
          <CommitStep key={`commit_step_${key}`}>
            <Icon size={24} />
            <Typography tag="h6">{header}</Typography>
            <Typography tag="p">{description}</Typography>
          </CommitStep>
        ))}
      </CommitStepWrapper>
      <ModalBackground>
        <Grid flexDirection={isLteXS ? "column" : "row"}>
          <div>
            <Typography tag="h4" style={{ margin: 0 }}>
              <b>Backed by Boson's settlement layer</b>
            </Typography>
            <Typography tag="p">
              Boson Protocol's settlement layer secures the commercial exchange
              of on-chain value for real-world assets. You can be certain that
              when redeeming you will either receive the physical good or your
              money back
            </Typography>
            <LearnMore
              href="https://www.bosonprotocol.io/technology/"
              target="_blank"
            >
              <>
                Learn more
                <CaretRight size={32} />
              </>
            </LearnMore>
          </div>
        </Grid>
      </ModalBackground>
    </>
  );
}
