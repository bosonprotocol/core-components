import React from "react";
import { Loading as LoadingComponent } from "./Loading";

import { Grid } from "../Grid";

interface ILoading {
  size?: number;
  wrapperStyle?: React.CSSProperties;
  style?: React.CSSProperties;
  [x: string]: unknown;
}

const Loading: React.FC<ILoading> = ({
  style = {},
  size = 5,
  wrapperStyle,
  ...props
}) => {
  return (
    <Grid justifyContent="center" padding="5rem" style={wrapperStyle}>
      <LoadingComponent style={style} size={size} {...props} />
    </Grid>
  );
};

export default Loading;
