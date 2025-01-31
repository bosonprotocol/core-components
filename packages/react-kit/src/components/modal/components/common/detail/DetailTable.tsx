import React, { Fragment, useRef, useState } from "react";
import { Tooltip } from "../../../../tooltip/Tooltip";
import { Grid } from "../../../../ui/Grid";
import { Typography } from "../../../../ui/Typography";
import { Table } from "./Detail.style";
import { Instance } from "tippy.js";
import { CSSProperties } from "styled-components";
import { getCssVar } from "../../../../../theme";

export interface Data {
  hide?: boolean | undefined;
  name?: React.ReactNode | string;
  info?: React.ReactNode;
  tooltip?: React.ReactNode | string;
  value?: React.ReactNode | string;
  nextLine?: React.ReactNode | string;
}

interface Props {
  align?: boolean;
  textAlign?: CSSProperties["textAlign"];
  data: Readonly<Array<Data>>;
  noBorder?: boolean;
  inheritColor?: boolean;
  tag?: keyof JSX.IntrinsicElements;
  className?: string;
}

export default function DetailTable({
  textAlign,
  align,
  data,
  noBorder = false,
  inheritColor = false,
  tag = "span",
  className
}: Props) {
  const [displayIndex, setDisplayIndex] = useState<number | undefined>();
  const tipRef = useRef<Record<number, Instance<unknown>>>();
  return (
    <Table
      $noBorder={noBorder}
      $inheritColor={inheritColor}
      className={className}
    >
      <tbody>
        {data?.map(
          ({ hide = false, ...d }: Data, index: number) =>
            !hide && (
              <Fragment key={`tr_fragment_${index}`}>
                <tr>
                  <td>
                    <Grid justifyContent="flex-start">
                      <Typography
                        tag={tag}
                        onMouseEnter={() => {
                          setDisplayIndex(index);
                          tipRef.current?.[index]?.show();
                        }}
                        onMouseLeave={() => {
                          setDisplayIndex(undefined);
                          tipRef.current?.[index]?.hide();
                        }}
                        color={getCssVar("--sub-text-color")}
                      >
                        {d.name}
                      </Typography>

                      {d.info && (
                        <div
                          style={{
                            visibility:
                              index === displayIndex ? "visible" : "hidden"
                          }}
                        >
                          <Tooltip
                            content={d.info}
                            size={20}
                            onCreate={(tip) => {
                              if (!tipRef.current) {
                                tipRef.current = {};
                              }
                              tipRef.current[index] = tip;
                            }}
                          />
                        </div>
                      )}
                    </Grid>
                  </td>
                  <td>
                    <Grid
                      justifyContent={align ? "flex-start" : "flex-end"}
                      style={{ textAlign }}
                    >
                      {d.value}
                    </Grid>
                  </td>
                </tr>
                {d.nextLine ? (
                  <tr>
                    <td key={`tr_${index}_next`} colSpan={2}>
                      {d.nextLine}
                    </td>
                  </tr>
                ) : (
                  <></>
                )}
              </Fragment>
            )
        )}
      </tbody>
    </Table>
  );
}
