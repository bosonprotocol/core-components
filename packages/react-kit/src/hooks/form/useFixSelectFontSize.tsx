import React, { useEffect, useRef } from "react";

export const useFixSelectFontSize = ({
  selectClassName
}: {
  selectClassName: string;
}) => {
  const inputFontSize = useRef<string>();
  useEffect(() => {
    const input = document.createElement("input");
    input.type = "hidden";
    document.body.appendChild(input);

    const fontSizeInPx = window.getComputedStyle(input).fontSize;

    inputFontSize.current = fontSizeInPx;

    return () => {
      document.body.removeChild(input);
    };
  }, []);
  return {
    jsx: (
      <style>{`.${selectClassName}{
        [class*="-placeholder"],[class*="-singleValue"],[class*="-option"]{
          font-size: ${inputFontSize.current};
        }
      }`}</style>
    ),
    selectClassName
  };
};
