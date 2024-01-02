import { CaretDown, CaretUp } from "phosphor-react";
import React, { ReactElement, ReactNode, useState } from "react";
import styled, { CSSProperties } from "styled-components";
import { theme } from "../../theme";
import Grid from "./Grid";
const colors = theme.colors.light;

const IconWrapper = styled.div`
  display: flex;
  padding: 0.5rem;
  align-items: flex-start;
  flex-shrink: 0;
  border-radius: 1.25rem;
  border: 2px solid ${colors.border};
  background: ${colors.lightGrey};
`;

const Details = styled.details<Pick<DetailsSummaryProps, "$paddingSides">>`
  width: 100%;
  summary {
    cursor: pointer;
    display: flex;
    gap: 1rem;
    justify-content: space-between;
    align-items: center;

    padding-top: 1rem;
    padding-bottom: 1rem;
    padding-left: ${({ $paddingSides }) => $paddingSides};
    padding-right: ${({ $paddingSides }) => $paddingSides};

    border-top: 2px solid ${colors.border};
    border-bottom: 2px solid ${colors.border};

    font-size: 1rem;
    font-weight: 600;
    line-height: 1.5rem;
    letter-spacing: 0px;
    text-align: left;

    ::marker {
      content: none;
      display: none;
    }
    ::-webkit-details-marker {
      content: none;
      display: none;
    }

    + * {
      padding-top: 1.5rem;
      padding-bottom: 1.5rem;
      padding-left: ${({ $paddingSides }) => $paddingSides};
      padding-right: ${({ $paddingSides }) => $paddingSides};
    }
  }
`;

type DetailsSummaryProps = {
  summaryText: string;
  icon?: ReactElement;
  children: ReactNode;
  initiallyOpen?: boolean;
  className?: string;
  $paddingSides?: CSSProperties["paddingLeft"];
};

const caretProps = {
  size: 24
} as const;
export const DetailsSummary: React.FC<DetailsSummaryProps> = ({
  summaryText,
  children,
  className,
  initiallyOpen,
  icon,
  $paddingSides = "2rem"
}) => {
  const [open, setOpen] = useState<boolean>(initiallyOpen ?? false);
  return (
    <Details
      className={className}
      open={open}
      onClick={(e) => {
        e.preventDefault();
        setOpen(!open);
      }}
      $paddingSides={$paddingSides}
    >
      <summary>
        <Grid justifyContent="flex-start" gap="1rem">
          {icon && <IconWrapper>{icon}</IconWrapper>}
          {summaryText}
        </Grid>
        {open ? <CaretUp {...caretProps} /> : <CaretDown {...caretProps} />}
      </summary>
      {children}
    </Details>
  );
};
