import { useEffect, useRef, useState } from "react";
import { inputStyles } from "../../components/form/styles";
import styled from "styled-components";

export const useFixSelectFont = ({
  selectClassName,
  hasError
}: {
  selectClassName?: string;
  hasError?: boolean;
}) => {
  const inputFontSize = useRef<string>();
  const styleTagRef = useRef<HTMLStyleElement | null>(null);
  const [styledComponentId] = useState(styled.div``.styledComponentId);

  const instanceClassName = `${selectClassName}-${styledComponentId}`;

  useEffect(() => {
    const input = document.createElement("input");
    input.type = "hidden";

    document.body.appendChild(input);

    const fontSizeInPx = window.getComputedStyle(input).fontSize;
    inputFontSize.current = fontSizeInPx;

    document.body.removeChild(input);
  }, []);

  useEffect(() => {
    // Create a new style element
    const styleTag = document.createElement("style");

    // Set the CSS content
    styleTag.innerHTML = `
      .${instanceClassName} {
        [class*="-placeholder"], [class*="-singleValue"], [class*="-option"] {
          font-size: ${inputFontSize.current || "0.875rem"};
        }
        ${
          hasError
            ? ""
            : `
          [class*="-singleValue"] {
            color: ${inputStyles.color};
          }
          [class*="-placeholder"] {
            color: ${inputStyles.placeholder.color};
          }
        `
        }
      }
    `;

    // Append the style tag to the document head
    document.head.appendChild(styleTag);

    // Save a reference to the style tag
    styleTagRef.current = styleTag;

    // Cleanup function to remove the style tag when the component unmounts or hasError changes
    return () => {
      if (styleTagRef.current) {
        document.head.removeChild(styleTagRef.current);
        styleTagRef.current = null;
      }
    };
  }, [instanceClassName, hasError]);

  return {
    selectClassName: instanceClassName // Return the unique class name
  };
};
