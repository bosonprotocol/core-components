import React from "react";

export const MagnifyingGlass = ({ size = 25, color = "#09182C" }) => {
  return (
    <svg
      width={size}
      height={size}
      preserveAspectRatio="xMidYMid"
      viewBox={`0 0 ${size + 5} ${size + 5}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.5 25.0005C20.299 25.0005 25 20.2995 25 14.5005C25 8.7015 20.299 4.00049 14.5 4.00049C8.70101 4.00049 4 8.7015 4 14.5005C4 20.2995 8.70101 25.0005 14.5 25.0005Z"
        stroke={color}
        strokeWidth="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M21.9238 21.9255L27.9989 28.0006"
        stroke={color}
        strokeWidth="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};
