import { Formik } from "formik";
import uniqBy from "lodash.uniqby";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState
} from "react";
import styled from "styled-components";
import { isNumeric } from "../../../../lib/numbers/numbers";
import { getCssVar } from "../../../../theme";
import { isTruthy } from "../../../../types/helpers";
import { VariantV1, Variation } from "../../../../types/variants";
import { SimpleError } from "../../../error/SimpleError";
import { Select } from "../../../form";
import { SelectDataProps } from "../../../form/types";
import { Grid } from "../../../ui/Grid";

const selectWidth = "10rem";
export const ResponsiveVariationSelects = styled(VariationSelects)`
  container-type: inline-size;
  z-index: calc(var(--wcm-z-index) + 1);
  width: 100%;
  && {
    [data-grid] {
      [class*="container"] {
        width: 100%;
      }
      [class*="control"] {
        width: 100%;
      }
      flex-direction: column;
      @container (width > 300px) {
        justify-content: flex-start;
        flex-direction: row;
      }
      @container (350px < width) {
        [class*="container"] {
          width: auto;
        }
        [class*="control"] {
          width: auto;
        }
      }
    }
  }

  [class*="control"] {
    background-color: ${getCssVar("--background-accent-color")};
    border-color: ${getCssVar("--background-accent-color")};
    max-width: 100%;
    width: ${selectWidth};
  }
  [class*="menu"] {
    max-width: 100%;
    width: ${selectWidth};
  }
`;
interface Quantity {
  type: string[];
  quantityAvailable: string;
  soldOut: boolean;
}
const sizes = [
  "xxxxxs",
  "x-x-x-x-x-small",
  "extra extra extra extra extra small",
  "xxxxs",
  "x-x-x-x-small",
  "extra extra extra extra small",
  "xxxs",
  "x-x-x-small",
  "extra extra extra small",
  "xxs",
  "x-x-small",
  "extra extra small",
  "xs",
  "x-small",
  "extra small",
  "s",
  "small",
  "m",
  "medium",
  "l",
  "large",
  "xl",
  "x-large",
  "extra large",
  "xxl",
  "x-x-large",
  "extra extra large",
  "xxxl",
  "x-x-x-large",
  "extra extra extra large",
  "xxxxl",
  "x-x-x-x-large",
  "extra extra extra extra large",
  "xxxxxl",
  "x-x-x-x-x-large",
  "extra extra extra extra extra large"
] as const;

const sizesMapWithWeights = Object.fromEntries(
  Object.entries(Object.values(sizes)).map(([key, value]) => [value, +key])
);

const emptyLabel = "-";

const getVariationOption = (
  variation: Pick<Variation, "id" | "option"> | undefined,
  quantity?: Quantity[]
) => {
  if (!variation) {
    return;
  }
  const allVariants =
    quantity?.filter((q) => q.type.find((t) => t === variation?.id)) || [];
  const soldOut = allVariants.every((el) => el?.soldOut);
  const additionalLabel = soldOut ? " (Sold Out)" : "";

  return {
    label:
      variation.option === "-"
        ? emptyLabel
        : `${variation.option}${additionalLabel}`,
    value: variation.id
  };
};

const existsVariationWithSizeAndColor = (
  variant: VariantV1,
  { color, size }: { color: string; size: string }
): boolean => {
  const colorVariationMatch = variant.variations.some(
    (variation) => variation.type === "Color" && variation.id === color
  );
  const sizeVariationMatch =
    colorVariationMatch &&
    variant.variations.some(
      (variation) => variation.type === "Size" && variation.id === size
    );
  return !!sizeVariationMatch;
};

const getVariationsByType = (
  variants: VariantV1[] | undefined,
  type: Variation["type"],
  quantity?: Quantity[]
) => {
  return variants
    ? uniqBy(
        variants
          .map((variant) =>
            variant.variations.find((variation) => variation.type === type)
          )
          .filter(isTruthy),
        (variation) => variation.id
      )
        .map((variation) => {
          return getVariationOption(
            {
              ...variation
            },
            quantity
          );
        })
        .filter(isTruthy)
        .sort((a, b) => {
          if (type === "Size") {
            if (a.label === emptyLabel) {
              return -1;
            }
            if (isNumeric(a.label) && isNumeric(b.label)) {
              return parseFloat(a.label) - parseFloat(b.label);
            }
            const aWeight = sizesMapWithWeights[a.label.toLowerCase().trim()];
            const bWeight = sizesMapWithWeights[b.label.toLowerCase().trim()];
            if (aWeight !== undefined && bWeight !== undefined) {
              return aWeight < bWeight ? -1 : 1;
            }
            if (aWeight !== undefined) {
              return -1;
            }
            if (bWeight !== undefined) {
              return 1;
            }
            return a.label.localeCompare(b.label);
          }
          return a.label === emptyLabel ? -1 : a.label.localeCompare(b.label);
        })
    : [];
};

const getIsEmptyOption = (
  option: SelectDataProps<string> | undefined | null
): boolean => {
  return (
    !option ||
    !option.label ||
    !option.value ||
    option.label === "-" ||
    option.value === "-" ||
    option.label === emptyLabel ||
    option.value === emptyLabel
  );
};

interface Props {
  selectedVariant: VariantV1;
  setSelectedVariant:
    | Dispatch<SetStateAction<VariantV1 | undefined>>
    | undefined;
  variants: VariantV1[];
  disabled?: boolean;
}

export default function VariationSelects({
  selectedVariant,
  setSelectedVariant,
  variants,
  disabled,
  ...rest
}: Props) {
  useEffect(() => {
    const quantityAvailable = Number(
      selectedVariant?.offer?.quantityAvailable || 0
    );
    if (quantityAvailable === 0) {
      const newVariant = variants.find(
        (variant) => Number(variant?.offer?.quantityAvailable || 0) > 0
      );
      if (newVariant) {
        setDropdownVariant(newVariant);
        setSelectedVariant?.(newVariant);
      }
    }
  }, []); // eslint-disable-line

  const quantityAvailable: Quantity[] = useMemo(() => {
    return variants.map((v) => ({
      type: v.variations.map((el) => el.id),
      quantityAvailable: v.offer.quantityAvailable,
      soldOut: Number(v.offer.quantityAvailable || 0) === 0
    }));
  }, [variants]);

  const numValidColorVariants: number = getVariationsByType(
    variants,
    "Color",
    quantityAvailable
  ).filter((entry) => entry?.label !== emptyLabel).length;
  const numValidSizeVariants: number = getVariationsByType(
    variants,
    "Size",
    quantityAvailable
  ).filter((entry) => entry?.label !== emptyLabel).length;
  const [dropdownVariant, setDropdownVariant] = useState<
    Pick<VariantV1, "variations"> | undefined
  >(selectedVariant);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [lastChangedVariation, setLastChangedVariation] = useState<
    "" | "color" | "size"
  >("");
  const showDashInColor = lastChangedVariation === "size" && !!errorMessage;
  const showDashInSize = lastChangedVariation === "color" && !!errorMessage;
  return (
    <Formik
      initialValues={{
        color:
          showDashInColor || !dropdownVariant
            ? getVariationOption(
                { id: "", option: emptyLabel },
                quantityAvailable
              )
            : getVariationOption(
                dropdownVariant.variations.find(
                  (variation) => variation.type === "Color"
                ),
                quantityAvailable
              ),
        size:
          showDashInSize || !dropdownVariant
            ? getVariationOption(
                { id: "", option: emptyLabel },
                quantityAvailable
              )
            : getVariationOption(
                dropdownVariant.variations.find(
                  (variation) => variation.type === "Size"
                ),
                quantityAvailable
              )
      }}
      enableReinitialize
      onSubmit={(values) => {
        const selectedVariant = variants.find((variant) =>
          existsVariationWithSizeAndColor(variant as VariantV1, {
            color: values.color?.value || "",
            size: values.size?.value || ""
          })
        );
        setErrorMessage("");
        if (selectedVariant) {
          setSelectedVariant?.(selectedVariant as VariantV1);
          setDropdownVariant(selectedVariant);
        } else {
          setDropdownVariant({
            variations: [
              {
                id: values.color?.value || "",
                type: "Color",
                option: values.color?.label || ""
              },
              {
                id: values.size?.value || "",
                type: "Size",
                option: values.size?.label || ""
              }
            ]
          });
          const isEmptyColor = getIsEmptyOption(values.color);
          const isEmptySize = getIsEmptyOption(values.size);
          if (!isEmptyColor && !isEmptySize) {
            const color = values.color?.label || "-";
            const size = values.size?.label || "-";
            setErrorMessage(
              `The variant with color '${color}' and size '${size}' does not exist. Please select another combination.`
            );
          } else if (isEmptyColor && isEmptySize) {
            setErrorMessage(
              `This combination does not exist, please select another one.`
            );
          }
        }
      }}
    >
      {({ submitForm }) => {
        return (
          <div {...rest}>
            <Grid gap="1rem" data-grid>
              {numValidColorVariants > 0 && (
                <>
                  <Select
                    name="color"
                    options={getVariationsByType(
                      variants,
                      "Color",
                      quantityAvailable
                    )}
                    placeholder="Color"
                    label="Color:"
                    onChange={() => {
                      setLastChangedVariation("color");
                      submitForm();
                    }}
                    isDisabled={disabled}
                  />
                </>
              )}
              {numValidSizeVariants > 0 && (
                <>
                  <Select
                    name="size"
                    options={getVariationsByType(
                      variants,
                      "Size",
                      quantityAvailable
                    )}
                    placeholder="Size"
                    label="Size:"
                    onChange={() => {
                      setLastChangedVariation("size");
                      submitForm();
                    }}
                    isDisabled={disabled}
                  />
                </>
              )}
            </Grid>
            {errorMessage && (
              <SimpleError style={{ marginBottom: "2.5rem" }}>
                {errorMessage}
              </SimpleError>
            )}
          </div>
        );
      }}
    </Formik>
  );
}
