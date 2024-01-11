import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  SubTitle,
  Title,
  Tooltip
} from "chart.js";
import { Line } from "react-chartjs-2";
import React from "react";

import { useOfferDataset } from "./useOfferDataset";
import Typography from "../ui/Typography";
import styled from "styled-components";
import { Offer } from "../../types/offer";

const ChartWrapper = styled.div`
  canvas {
    max-width: 100%;
  }
`;

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineController,
  Filler,
  LineElement,
  Title,
  Tooltip,
  SubTitle,
  Legend
);

interface Props {
  offer: Offer;
  title?: string;
  className?: string;
}

export function DetailChart({ offer, title, className }: Props) {
  const { options, data, display } = useOfferDataset(offer);

  if (!display) {
    return null;
  }

  return (
    <div className={className}>
      <Typography tag="h3">{title || "Graph"}</Typography>
      <ChartWrapper>
        <Line
          options={{ ...options, maintainAspectRatio: false }}
          data={data}
        />
      </ChartWrapper>
    </div>
  );
}
