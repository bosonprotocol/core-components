import styled from "styled-components";
import { breakpoint } from "../../lib/ui/breakpoint";
import React, {
  CSSProperties,
  ElementRef,
  HTMLAttributes,
  forwardRef
} from "react";
import { getTransientCustomProps } from "./getTransientCustomProps";
import { isDefined } from "./common";
import { AddDollarPrefixToKeys } from "../../types/helpers";

export interface ItemsPerRow {
  xxs?: number;
  xs: number;
  s: number;
  m: number;
  l: number;
  xl: number;
}

export interface ColumnGapPerRow {
  xs: CSSProperties["columnGap"];
  s: CSSProperties["columnGap"];
  m: CSSProperties["columnGap"];
  l: CSSProperties["columnGap"];
  xl: CSSProperties["columnGap"];
}

export interface RowGapPerRow {
  xs: CSSProperties["rowGap"];
  s: CSSProperties["rowGap"];
  m: CSSProperties["rowGap"];
  l: CSSProperties["rowGap"];
  xl: CSSProperties["rowGap"];
}
const pickedProps = {
  itemsPerRow: true,
  columnGapPerRow: true,
  rowGapPerRow: true,
  columnGap: true,
  rowGap: true,
  defaultSize: true,
  width: true
} as const;
type GridProps = {
  itemsPerRow?: Partial<ItemsPerRow>;
  columnGapPerRow?: Partial<ColumnGapPerRow>;
  rowGapPerRow?: Partial<RowGapPerRow>;
  columnGap?: CSSProperties["columnGap"];
  rowGap?: CSSProperties["rowGap"];
  defaultSize?: string;
  width?: CSSProperties["width"];
};

type InnerGridProps = AddDollarPrefixToKeys<GridProps>;

const GridContainerDiv = styled.div<InnerGridProps>`
  display: grid;
  grid-column-gap: ${({ $columnGap }) => $columnGap || "2rem"};
  grid-row-gap: ${({ $rowGap }) => $rowGap || "2rem"};

  grid-template-columns: repeat(
    ${({ $itemsPerRow }) => $itemsPerRow?.xxs || "1"},
    ${({ $defaultSize }) => $defaultSize || "minmax(0, 1fr)"}
  );
  ${breakpoint.xs} {
    grid-template-columns: repeat(
      ${({ $itemsPerRow }) => $itemsPerRow?.xs || "2"},
      ${({ $defaultSize }) => $defaultSize || "minmax(0, 1fr)"}
    );
    grid-column-gap: ${({ $columnGapPerRow }) => $columnGapPerRow?.xs};
    grid-row-gap: ${({ $rowGapPerRow }) => $rowGapPerRow?.xs};
  }
  ${breakpoint.s} {
    grid-template-columns: repeat(
      ${({ $itemsPerRow }) => $itemsPerRow?.s || "3"},
      ${({ $defaultSize }) => $defaultSize || "minmax(0, 1fr)"}
    );
    grid-column-gap: ${({ $columnGapPerRow }) => $columnGapPerRow?.s};
    grid-row-gap: ${({ $rowGapPerRow }) => $rowGapPerRow?.s};
  }
  ${breakpoint.m} {
    grid-template-columns: repeat(
      ${({ $itemsPerRow }) => $itemsPerRow?.m || "3"},
      ${({ $defaultSize }) => $defaultSize || "minmax(0, 1fr)"}
    );
    grid-column-gap: ${({ $columnGapPerRow }) => $columnGapPerRow?.m};
    grid-row-gap: ${({ $rowGapPerRow }) => $rowGapPerRow?.m};
  }
  ${breakpoint.l} {
    grid-template-columns: repeat(
      ${({ $itemsPerRow }) => $itemsPerRow?.l || "3"},
      ${({ $defaultSize }) => $defaultSize || "minmax(0, 1fr)"}
    );
    grid-column-gap: ${({ $columnGapPerRow }) => $columnGapPerRow?.l};
    grid-row-gap: ${({ $rowGapPerRow }) => $rowGapPerRow?.l};
  }
  ${breakpoint.xl} {
    grid-template-columns: repeat(
      ${({ $itemsPerRow }) => $itemsPerRow?.xl || "3"},
      ${({ $defaultSize }) => $defaultSize || "minmax(0, 1fr)"}
    );
    grid-column-gap: ${({ $columnGapPerRow }) => $columnGapPerRow?.xl};
    grid-row-gap: ${({ $rowGapPerRow }) => $rowGapPerRow?.xl};
  }

  ${({ $width }) => (isDefined($width) ? `width:${$width}` : "")};
`;
type DivProps = HTMLAttributes<ElementRef<"div">>;
export type GridContainerProps = DivProps & GridProps;

export const GridContainer = forwardRef<ElementRef<"div">, GridContainerProps>(
  (props, ref) => {
    const { transientProps, otherProps } = getTransientCustomProps<
      InnerGridProps,
      DivProps
    >(props, pickedProps);

    return <GridContainerDiv {...transientProps} {...otherProps} ref={ref} />;
  }
);
