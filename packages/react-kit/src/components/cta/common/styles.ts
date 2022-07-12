import styled from "styled-components";

export const ExtraInfo = styled.span`
  font-style: normal;
  font-weight: 600;
  font-size: 0.75rem;
  line-height: 150%;
  margin-left: 3.75rem;
  color: ${({ theme }) => theme?.colors?.light.black};
  opacity: 0.5;
`;
