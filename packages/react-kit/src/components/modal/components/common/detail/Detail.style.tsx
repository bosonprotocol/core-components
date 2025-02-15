import styled, { css } from "styled-components";
import { breakpoint } from "../../../../../lib/ui/breakpoint";
import { colors, getCssVar } from "../../../../../theme";
import { Grid } from "../../../../ui/Grid";
import ThemedButton from "../../../../ui/ThemedButton";
import { zIndex } from "../../../../ui/zIndex";

import frameImage from "../../../../../assets/frame.png";
import { buttonText } from "../../../../ui/styles";

export const ChartWrapper = styled.div`
  canvas {
    max-width: 100%;
  }
`;

export const Labels = styled.div`
  display: flex;
  margin-left: 1rem;
`;

export const Label = styled.div<{ $background: string; $color: string }>`
  background: ${(props) =>
    props.$background || getCssVar("--background-color")};
  color: ${(props) => props.$color || getCssVar("--sub-text-color")};
  padding: 0.5rem 1rem;
  font-family: "Plus Jakarta Sans";
  font-style: normal;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1.5;
  text-transform: lowercase;
  &:first-letter {
    text-transform: uppercase;
  }
`;

export const CommitStep = styled.div`
  position: relative;
  padding: 1rem;
  background: ${getCssVar("--background-color")};
  &:not(:last-child) {
    &:before {
      position: absolute;
      content: "";
      width: 0;
      height: 0;

      bottom: -1rem;
      left: 50%;
      transform: translate(-50%, 0);
      border-left: 30rem solid transparent;
      border-right: 30rem solid transparent;
      border-top: 1rem solid ${getCssVar("--background-color")};
    }

    &:after {
      position: absolute;
      content: "";
      width: 0;
      height: 0;

      bottom: -2rem;
      left: 50%;
      transform: translate(-50%, 0);
      border-left: 30rem solid transparent;
      border-right: 30rem solid transparent;
      border-top: 1rem solid ${getCssVar("--background-accent-color")};
      z-index: 1;
    }
  }
  ${breakpoint.m} {
    &:not(:first-child) {
      padding-left: 2rem;
    }
    &:not(:last-child) {
      &:before {
        position: absolute;
        content: "";
        width: 0;
        height: 0;

        top: 50%;
        bottom: 0;
        right: -1rem;
        left: initial;
        transform: translate(0%, -50%);
        border-top: 10rem solid transparent;
        border-left: 1rem solid ${getCssVar("--background-color")};
        border-bottom: 10rem solid transparent;
        border-right: none;
      }

      &:after {
        position: absolute;
        content: "";
        width: 0;
        height: 0;

        top: 50%;
        bottom: 0;
        right: -2rem;
        left: initial;
        transform: translate(0%, -50%);
        border-top: 10rem solid transparent;
        border-left: 1rem solid ${getCssVar("--background-accent-color")};
        border-bottom: 10rem solid transparent;
        border-right: none;
        z-index: 1;
      }
    }
  }
`;

export const LearnMore = styled.a`
  all: unset;
  display: flex;
  gap: 0.5rem;
  align-items: center;
  cursor: pointer;
  ${() => buttonText};
  color: var(--secondary);

  transition: all 150ms ease-in-out;
  > svg {
    transition: all 150ms ease-in-out;
    transform: translateX(0);
  }
  &:hover {
    color: var(--primary);
    > svg {
      transform: translateX(5px);
      fill: var(--primary);
    }
  }
`;

export const ModalBackground = styled.div`
  overflow: hidden;
  margin: -2rem -2rem 2rem -2rem;
  padding: 2rem;
  background-color: ${colors.black};
  background-image: url(${frameImage});

  background-repeat: no-repeat;
  background-position: bottom right;
  padding-right: 2rem;
  padding-bottom: 20rem;

  ${breakpoint.s} {
    padding-right: 15rem;
    padding-bottom: 12rem;
  }
  color: ${colors.white};
`;

export const ShareWrapper = styled.div`
  display: flex;
  flex-direction: column;

  ${breakpoint.s} {
    position: relative;
  }
  ${breakpoint.m} {
    position: absolute;
    max-width: 5rem;
    right: -5rem;
    top: 0;
  }
  ${breakpoint.xl} {
  }
`;

export const Notify = styled.div<{ $show: boolean }>`
  transform: ${({ $show }) => ($show ? "translateY(0)" : "translateY(10rem)")};

  transition: transform 500ms ease-in-out;
  position: fixed;
  z-index: ${zIndex.Notification};
  bottom: 1rem;
  right: 1rem;

  color: ${colors.white};
  background: ${colors.blue};
  padding: 0 1rem;
`;

export const ModalImageWrapper = styled.div`
  position: relative;
  max-width: 35rem;
  min-width: 50%;
  width: -webkit-fill-available;
`;
export const ImageWrapper = styled.div`
  position: relative;
  max-width: 35rem !important;
  min-width: 50%;
  width: -webkit-fill-available;
`;

export const GlideSlide = styled.div`
  overflow: hidden;
  .glide__slide--active {
    align-self: center;
  }
`;

const tableBorder = css`
  tbody {
    tr {
      &:not(:last-child) {
        td {
          border-bottom: 1px solid ${getCssVar("--border-color")};
        }
      }
    }
  }
`;

const tableStyles = css`
  width: 100%;
  p {
    margin: 0;
  }

  thead {
    tr {
      th {
        font-weight: 600;
        font-size: 0.75rem;
        text-align: left;
        line-height: 150%;
      }
    }
  }
  tbody {
    tr {
      td {
        font-weight: 400;
        font-size: 1rem;
        line-height: 150%;
      }
    }
  }

  th,
  td {
    font-style: normal;
    font-size: 1rem;
    line-height: 150%;
  }
`;

export const Transactions = styled.table`
  ${tableStyles}
  ${tableBorder}

  th,
  td {
    padding: 0.5rem 0.25rem;
  }
`;

export const Table = styled.table<{
  $noBorder?: boolean;
  $inheritColor?: boolean;
}>`
  ${tableStyles}

  th,
  td {
    padding: 0.25rem 0.1rem;

    ${({ $inheritColor }) =>
      $inheritColor
        ? css`
            color: inherit;
          `
        : css`
            color: ${getCssVar("--sub-text-color")};
          `}
  }
  tr {
    td {
      &:first-child {
        width: 60%;
        font-weight: 600;
      }
      &:last-child {
        width: 40%;
        font-weight: 400;
      }
    }
    ${({ $noBorder }) =>
      $noBorder
        ? css`
        td {
          > div {
              font-weight: 600;
              > p, > p > small {
                font-weight: 600;
                white-space: pre-wrap;
              }
          }
        }
        }`
        : css`
            td {
              border-bottom: 1px solid ${getCssVar("--border-color")};
            }
          `}
  }
`;

export const DetailWrapper = styled.div`
  padding: 0;
  ${breakpoint.s} {
    padding: 0 2rem;
  }
  ${breakpoint.m} {
    padding: 0 6rem;
  }
  ${breakpoint.l} {
    padding: 0 8rem;
  }
  ${breakpoint.xl} {
    padding: 0 10rem;
  }
  > div:first-child {
    padding-top: 2rem;
  }
  > div:not(:last-child) {
    margin-bottom: 4rem;
  }
  > div:last-child {
    padding-bottom: 4rem;
  }
`;

export const DetailGrid = styled.div`
  position: relative;
  display: grid;

  grid-column-gap: 1em;
  grid-row-gap: 1rem;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  ${breakpoint.s} {
    grid-column-gap: 3rem;
    grid-row-gap: 3rem;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  > div {
    max-width: 100%;
  }
`;

export const WidgetUpperGrid = styled.div`
  display: grid;
  grid-column-gap: 1em;
  grid-row-gap: 1rem;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  align-items: center;

  ${breakpoint.s} {
    grid-column-gap: 2rem;
    grid-row-gap: 2rem;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  > button {
    min-width: unset !important;
    div {
      justify-content: space-between;
      gap: 1rem;
      > div,
      > span {
        margin-left: unset !important;
      }
    }
  }
`;

export const MainDetailGrid = styled.div`
  position: relative;
  display: grid;

  grid-column-gap: 1em;
  grid-row-gap: 2rem;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  grid-template-rows: 2fr;

  align-items: start;
  justify-items: center;

  ${breakpoint.s} {
    grid-column-gap: 2rem;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-template-rows: 1fr;
  }
  ${breakpoint.s} {
    grid-column-gap: 3rem;
  }
  > div {
    max-width: 100%;
  }
`;

export const DarkerBackground = styled.div`
  padding: 2rem 0;
  max-width: 100%;
  background-color: var(--secondary);
  position: relative;
  > div:not(:last-child) {
    margin-bottom: 2rem;
  }

  &:before,
  &:after {
    content: "";
    width: 100rem;
    top: 0;
    bottom: 0;
    position: absolute;
    background-color: var(--secondary);
    z-index: -1;
  }
  &:before {
    right: -100rem;
  }
  &:after {
    left: -100rem;
  }
`;

export const LightBackground = styled.div`
  max-width: 100%;
  position: relative;
`;

export const ModalGrid = styled.div`
  display: grid;

  grid-column-gap: 1rem;
  grid-row-gap: 1rem;
  grid-template-columns: repeat(1, minmax(0, 1fr));

  align-items: start;
  justify-items: center;

  ${breakpoint.s} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

export const WidgetButtonWrapper = styled(Grid)`
  gap: 1rem;
  margin-top: 1rem;
  flex-direction: column;
  ${breakpoint.s} {
    flex-direction: row;
    align-content: space-between;
  }
  > * {
    width: 100%;
    ${breakpoint.s} {
      width: unset;
    }
    > div {
      justify-content: center;
    }
  }
`;

export const BosonExclusiveContainer = styled.div`
  && {
    position: absolute;
    bottom: 0;
    padding: 0.25rem 1rem;
    background-color: ${getCssVar("--background-accent-color")};
    color: ${getCssVar("--main-text-color")};
    width: auto;
    font-size: 0.75rem;
    font-style: normal;
    font-weight: 600;
    line-height: 150%;
    border-radius: 1.0625rem 1.0625rem 0rem 0rem;
  }
`;

export const BaseWidget = styled.div`
  container-type: inline-size;
  position: relative;
  display: flex;
  align-content: flex-start;
  flex-wrap: wrap;
  width: 100%;
  background: ${getCssVar("--background-accent-color")};
  border: 2px solid ${getCssVar("--border-color")};
  border-radius: ${getCssVar("--modal-border-radius")};
  font-family: "Plus Jakarta Sans";
  details:not(details:nth-last-of-type(1)):not([open]) > summary {
    border-bottom: none;
  }
  > div {
    padding-left: 2rem;
    padding-right: 2rem;
  }

  > div {
    width: 100%;
  }
`;

const miniButton = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 2rem;
  background: ${colors.white};
  color: ${colors.blue};

  font-style: normal;
  font-weight: 600;
  font-size: 0.75rem;
  line-height: 150%;
  &:hover {
    color: ${colors.black};
  }
`;
export const OpenSeaButton = styled.a<{ $disabled: boolean }>`
  z-index: ${zIndex.OfferStatus};
  border: 2px solid ${getCssVar("--border-color")};
  padding: 1rem;
  ${miniButton}

  ${({ $disabled }) =>
    $disabled &&
    css`
      pointer-events: none;
      color: ${colors.grey};
      &:hover {
        color: ${colors.grey};
      }
    `}
`;

export const RedeemLeftButton = styled.button`
  cursor: pointer;
  transition: all 150ms ease-in-out;
  &:hover {
    background: ${colors.greyLight};
  }

  ${miniButton}
  color: ${colors.black};
`;

export const RaiseProblemButton = styled(ThemedButton)`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  padding: 0.75rem 1rem;

  font-weight: 600;
  color: ${colors.violet};
  cursor: pointer;
  transition: all 150ms ease-in-out;
  &:hover:not(:disabled) {
    color: ${colors.red};
    background: ${colors.greyLight};
  }
  svg {
    margin-left: 1rem;
  }
`;
export const StyledCancelButton = RaiseProblemButton;
export const ContactSellerButton = styled(RaiseProblemButton)`
  color: ${colors.violet};
`;

export const Break = styled.span`
  display: block;
  width: 100%;
  height: 2px;
  background: ${getCssVar("--border-color")};
`;
