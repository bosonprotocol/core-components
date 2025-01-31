import React, { useEffect, useRef } from "react";
import { inputStyles } from "../../components/form/styles";

export const useFixSelectFont = ({
  selectClassName,
  hasError
}: {
  selectClassName: string;
  hasError?: boolean;
}) => {
  const inputFontSize = useRef<string>();
  useEffect(() => {
    const input = document.createElement("input");
    input.type = "hidden";

    document.body.appendChild(input);

    const fontSizeInPx = window.getComputedStyle(input).fontSize;
    inputFontSize.current = fontSizeInPx;

    document.body.removeChild(input);
  }, []);
  return {
    jsx: (
      <style>{`.${selectClassName}{
        [class*="-placeholder"],[class*="-singleValue"],[class*="-option"]{
          font-size: ${inputFontSize.current || "0.875rem"};
        }
        ${
          hasError
            ? ""
            : `
        [class*="-singleValue"]{
          color: ${inputStyles.color};
        }
        [class*="-placeholder"]{
          color: ${inputStyles.placeholder.color};
        }
          `
        }
        
      }`}</style>
    ),
    selectClassName
  };
};
