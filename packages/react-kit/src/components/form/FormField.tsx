import React from "react";
import isObject from "lodash/isObject";
import mapValues from "lodash/mapValues";
import { Copy } from "phosphor-react";
import toast from "react-hot-toast";
import { colors } from "../../theme";

import { Tooltip } from "../tooltip/Tooltip";
import { Grid } from "../ui/Grid";
import { Typography } from "../ui/Typography";
import { CopyButton, FormFieldWrapper } from "./Field.styles";
import type { FormFieldProps } from "./types";
export type { FormFieldProps } from "./types";

export function FormField({
  title,
  titleIcon,
  subTitle = false,
  required = false,
  tooltip,
  children,
  style = {},
  valueToCopy,
  copyIconColor = colors.violet,
  ...rest
}: FormFieldProps) {
  return (
    <FormFieldWrapper
      justifyContent="flex-start"
      flexDirection="column"
      alignItems="flex-start"
      flexGrow="1"
      style={style}
      {...rest}
    >
      <>
        <Grid justifyContent="flex-start" margin="0 0 0.375rem 0">
          <Typography data-header tag="p">
            {title}
            {"  "}
            {required && "*"}
            {valueToCopy && (
              <CopyButton
                onClick={() => {
                  try {
                    const isItObject = isObject(valueToCopy);
                    let copyThat = "";
                    if (isItObject) {
                      mapValues(valueToCopy, (value) => {
                        copyThat += `${value}\n`;
                      });
                    } else {
                      copyThat = valueToCopy;
                    }

                    navigator.clipboard.writeText(copyThat);
                    toast(() => "Text has been copied to clipboard");
                  } catch (error) {
                    console.error(error);
                    return false;
                  }
                }}
              >
                <Copy size={24} color={copyIconColor} weight="light" />
              </CopyButton>
            )}
          </Typography>
          {titleIcon}
          {tooltip && <Tooltip content={tooltip} size={16} />}
        </Grid>
        {subTitle && (
          <Grid
            justifyContent="flex-start"
            style={{ marginBottom: "0.875rem" }}
          >
            <Typography data-subheader tag="p">
              {subTitle}
            </Typography>
          </Grid>
        )}
        {children}
      </>
    </FormFieldWrapper>
  );
}
