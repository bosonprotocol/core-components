import React from "react";
import type { Dayjs } from "dayjs";
import { useField } from "formik";

import Error from "./Error";
import type { DatepickerProps } from "./types";
import DatePicker from "../datepicker/DatePicker";

export default function DatepickerComponent({
  name,
  period = false,
  selectTime = false,
  ...rest
}: DatepickerProps) {
  const [field, meta, helpers] = useField(name);

  const errorMessage = meta.error && meta.touched ? meta.error : "";
  const displayError = typeof errorMessage === "string" && errorMessage !== "";

  const handleChange = (date: Dayjs | Array<Dayjs | null>) => {
    if (!meta.touched) {
      helpers.setTouched(true);
    }
    helpers.setValue(date);
  };

  return (
    <>
      <DatePicker
        onChange={handleChange}
        error={errorMessage}
        period={period}
        selectTime={selectTime}
        initialValue={field.value}
        {...rest}
      />
      <Error display={displayError} message={errorMessage} />
    </>
  );
}
