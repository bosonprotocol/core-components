import dayjs from "dayjs";
import { checkIfTimestampIsToo } from "../dates/checkIfTimestampIsToo";
import { getDateTimestamp } from "../dates/getDateTimestamp";
import { Offer } from "../../types/offer";

type GetIsOfferExpiredProps =
  | {
      offer: Offer;
    }
  | {
      validUntilDate: string;
    };
export const getIsOfferExpired = (props: GetIsOfferExpiredProps): boolean => {
  const now = dayjs();
  const validUntilDateProp =
    "offer" in props ? props.offer.validUntilDate : props.validUntilDate;
  const validUntilDateTimestamp = getDateTimestamp(validUntilDateProp);
  const validUntilDate = dayjs(validUntilDateTimestamp);
  const isNotExpired =
    checkIfTimestampIsToo("too_big", validUntilDateTimestamp) ||
    validUntilDate.isAfter(now);
  return !isNotExpired;
};
