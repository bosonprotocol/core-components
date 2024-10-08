import { offers as OffersKit, subgraph } from "@bosonprotocol/core-sdk";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { useMemo } from "react";
import { getDateTimestamp } from "../lib/dates/getDateTimestamp";

import { Offer } from "../types/offer";
import { checkIfTimestampIsToo } from "../lib/dates/checkIfTimestampIsToo";
import { getIsOfferExpired } from "../lib/offer/getIsOfferExpired";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Europe/Greenwich");

export function useHandleText(offer: Offer, dateFormat = "YYYY/MM/DD") {
  const handleDate = (
    offer: Offer,
    validVariants: subgraph.OfferFieldsFragment[]
  ) => {
    const current = dayjs();
    const hasVariants = !!validVariants.length;
    const earliestValidFromDate = hasVariants
      ? Math.min(
          ...(validVariants.map((variant) =>
            getDateTimestamp(variant.validFromDate)
          ) || [0])
        )
      : getDateTimestamp(offer?.validFromDate);
    const latestValidUntilDate = hasVariants
      ? Math.max(
          ...(validVariants.map((variant) =>
            getDateTimestamp(variant.validUntilDate)
          ) || [0])
        )
      : getDateTimestamp(offer?.validUntilDate);
    const release = dayjs(earliestValidFromDate);
    const expiry = dayjs(latestValidUntilDate);

    return {
      current,
      release: {
        date: release.format(dateFormat),
        diff: {
          days: release.diff(current, "days"),
          isToday: release.isSame(current, "day"),
          isReleased: release.isBefore(current),
          hours: release.diff(current, "hours"),
          time: release.format("HH:mm")
        }
      },
      expiry: {
        date: expiry.format(dateFormat),
        diff: {
          days: expiry.diff(current, "days"),
          isToday: expiry.isSame(current, "day"),
          isExpired: getIsOfferExpired({
            validUntilDate: latestValidUntilDate.toString()
          }),
          hours: expiry.diff(current, "hours"),
          time: expiry.format("HH:mm"),
          withExpirationDate: !checkIfTimestampIsToo(
            "too_big",
            latestValidUntilDate
          )
        }
      }
    };
  };
  const handleText = useMemo(() => {
    const validVariants =
      offer.additional?.variants.filter(
        (variant) =>
          OffersKit.getOfferStatus(variant) === OffersKit.OfferState.VALID
      ) || [];
    const { release, expiry } = handleDate(offer, validVariants);
    const aspectRatio = 1 / 2;
    const hasVariants = !!offer.additional?.variants.length;
    const optionVoided = hasVariants
      ? offer.additional?.variants.every(
          (variant) =>
            OffersKit.getOfferStatus(variant) === OffersKit.OfferState.VOIDED
        )
      : offer.voided;
    const quantityAvailable = hasVariants
      ? validVariants
          .map((variant) => Number(variant.quantityAvailable))
          .reduce((prev, a) => prev + a, 0) || 0
      : Number(offer?.quantityAvailable);
    const quantityInitial = hasVariants
      ? validVariants
          .map((variant) => Number(variant.quantityInitial))
          .reduce((prev, a) => prev + a, 0) || 0
      : Number(offer?.quantityInitial);
    const optionQuantity =
      quantityInitial > 0
        ? quantityAvailable / quantityInitial < aspectRatio
        : false;
    const optionRelease =
      !release.diff.isReleased &&
      release.diff.days >= 0 &&
      expiry.diff.days !== 0;
    const utcOffset = -(new Date().getTimezoneOffset() / 60);
    const utcValue =
      utcOffset === 0 ? "" : utcOffset < 0 ? `-${utcOffset}` : `+${utcOffset}`;

    if (optionQuantity) {
      return quantityAvailable === 0
        ? "Sold out"
        : `Only ${quantityAvailable}/${quantityInitial} left`;
    } else if (optionRelease) {
      return release.diff.days <= 10
        ? release.diff.days <= 0
          ? `Releases ${release.diff.isToday ? "today" : "tomorrow"} at ${
              release.diff.time
            } UTC${utcValue}`
          : `Releases in ${release.diff.days} ${
              release.diff.days === 1 ? "day" : "days"
            }`
        : `Releases on ${release.date}`;
    } else if (!optionVoided) {
      return !expiry.diff.withExpirationDate
        ? "Does not expire"
        : expiry.diff.isExpired
          ? `Expired`
          : expiry.diff.days <= 10
            ? expiry.diff.days <= 0
              ? `Expires ${expiry.diff.isToday ? "today" : "tomorrow"} at ${
                  expiry.diff.time
                } UTC${utcValue}`
              : `Expires in ${expiry.diff.days} ${
                  expiry.diff.days === 1 ? "day" : "days"
                }`
            : `Expires on ${expiry.date}`;
    } else if (optionVoided) {
      return "Voided";
    }
    return "";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offer]);

  return handleText;
}
