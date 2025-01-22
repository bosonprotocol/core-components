import { useField, useFormikContext } from "formik";
import { KeyReturn } from "phosphor-react";
import React, { useEffect, useRef, useState } from "react";

import { Grid } from "../ui/Grid";
import { Typography } from "../ui/Typography";
import Error from "./Error";
import { FieldInput, HeightSize, InputTheme } from "./Field.styles";
import {
  Close,
  Helper,
  TagContainer,
  TagWrapper
} from "./styles/BaseTagsInput.styles";
import { TagsProps as TagsPropsWithoutTheme } from "./types";
export type BaseTagsInputProps = TagsPropsWithoutTheme & {
  theme?: InputTheme;
  heightSize?: HeightSize;
};
const gap = "0.5rem";
export const BaseTagsInput = ({
  name,
  placeholder,
  onAddTag,
  onRemoveTag,
  compareTags = (tagA: string, tagB: string) =>
    tagA.toLowerCase() === tagB.toLowerCase(),
  transform = (tag: string) => tag,
  label,
  heightSize,
  theme
}: BaseTagsInputProps) => {
  const { validateForm } = useFormikContext();
  const [field, meta, helpers] = useField<string[]>(name);
  const tags = field.value || [];

  const errorMessage = meta.error && meta.touched ? meta.error : "";
  const displayError = typeof errorMessage === "string" && errorMessage !== "";

  const handleBlur = () => {
    if (!meta.touched) {
      helpers.setTouched(true);
    }
  };

  function handleKeyDown(
    event: Parameters<React.KeyboardEventHandler<HTMLInputElement>>[0]
  ) {
    if (event.key !== "Enter") return;
    event.preventDefault();
    const target = event.target as HTMLInputElement;
    const value: string = target.value;
    if (!value.trim()) return;
    target.value = "";
    if (!meta.touched) {
      helpers.setTouched(true);
    }

    if (!tags.find((tag) => compareTags(tag, value))) {
      const transformedValue = transform(value);
      const newTags = [...tags, transformedValue];
      helpers.setValue(newTags);
      onAddTag?.(transformedValue);
    }
  }

  function removeTag(index: number) {
    const filteredTags = tags.filter((_, i) => i !== index);
    helpers.setValue(filteredTags);
    if (!meta.touched) {
      helpers.setTouched(true);
    }
    onRemoveTag?.(tags[index]);
  }
  useEffect(() => {
    validateForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field.value]);

  const [inputPaddingRight, setInputPaddingRight] = useState<
    string | undefined
  >(undefined);
  const labelRef = useRef<HTMLDivElement>(null);
  const hitEnterWidth = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (hitEnterWidth.current) {
      setInputPaddingRight(
        `calc(${hitEnterWidth.current.clientWidth}px + 1rem)`
      );
    }
  }, []);
  const [tagContainerPaddingLeft, setTagContainerPaddingLeft] = useState<
    string | undefined
  >(undefined);

  useEffect(() => {
    if (labelRef.current) {
      setTagContainerPaddingLeft(
        `calc(${labelRef.current.clientWidth}px + ${gap})`
      );
    }
  }, []);
  return (
    <>
      <Grid gap={gap} alignItems="center">
        {label && (
          <Typography data-label ref={labelRef}>
            {label}
          </Typography>
        )}
        <TagContainer $gap={gap}>
          <FieldInput
            theme={theme}
            $heightSize={heightSize}
            onKeyDown={handleKeyDown}
            type="text"
            placeholder={placeholder || "Choose tags..."}
            name={name}
            onBlur={handleBlur}
            $error={errorMessage}
            {...(hitEnterWidth.current?.clientWidth && {
              style: {
                paddingRight: inputPaddingRight
              }
            })}
          />
          <Helper ref={hitEnterWidth}>
            Hit Enter <KeyReturn size={13} />
          </Helper>
        </TagContainer>
      </Grid>
      <TagContainer
        $gap={gap}
        $paddingLeft={label ? tagContainerPaddingLeft : undefined}
      >
        {tags.map((tag: string, index: number) => (
          <TagWrapper key={`tags-wrapper_${tag}`} theme={theme}>
            <span className="text tag">{tag}</span>
            <Close onClick={() => removeTag(index)}>&times;</Close>
          </TagWrapper>
        ))}
      </TagContainer>
      <Error display={displayError} message={errorMessage} />{" "}
    </>
  );
};
