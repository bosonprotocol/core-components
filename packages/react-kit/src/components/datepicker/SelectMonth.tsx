import type { Dayjs } from "dayjs";
import { CaretLeft, CaretRight } from "phosphor-react";
import React, { useCallback } from "react";
import ThemedButton from "../ui/ThemedButton";

import Typography from "../ui/Typography";
import { Selector } from "./DatePicker.style";
import { changeMonth } from "./utils";

interface Props {
  month: Dayjs;
  setMonth: React.Dispatch<React.SetStateAction<Dayjs>>;
}

export default function SelectMonth({ month, setMonth }: Props) {
  const handleMonthChange = useCallback(
    (isNext: boolean) => setMonth(changeMonth(month, isNext)),
    [setMonth, month]
  );

  return (
    <Selector>
      <ThemedButton theme="blank" onClick={() => handleMonthChange(false)}>
        <CaretLeft size={18} />
      </ThemedButton>
      <Typography tag="p">{month.format("MMMM YYYY")}</Typography>
      <ThemedButton theme="blank" onClick={() => handleMonthChange(true)}>
        <CaretRight size={18} />
      </ThemedButton>
    </Selector>
  );
}
