import React, { useEffect, useRef } from "react";

export const useFixSelectFontSize = () => {
  const divRef = useRef<HTMLDivElement>(null);
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
      <style>{`.${divRef.current?.className.split(" ").join(".")}{
        [class*="-placeholder"],[class*="-singleValue"]{
          font-size: ${inputFontSize.current};
        }
      }`}</style>
    ),
    wrapperRef: divRef
  };
};
