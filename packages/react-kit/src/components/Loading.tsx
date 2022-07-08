import styled, { keyframes } from "styled-components";
import React from "react";

const Loading = () => {
  return <LoadingStyle></LoadingStyle>;
};

export default Loading;

const loadingAnimation = keyframes`
 0% { transform: rotate(0deg); }
 100% { transform: rotate(360deg); }
`;

const LoadingStyle = styled.span`
  width: 25px;
  height: 25px;
  border: 5px solid #fff;
  border-bottom-color: ${({ theme }) => theme?.colors?.light.secondary};
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
  animation-name: ${loadingAnimation};
`;
