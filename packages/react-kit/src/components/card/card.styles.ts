import styled from "styled-components";

export const CardLink = styled.a`
  font-family: Poppins, sans-serif;
  line-height: 1.5;
  font-size: 15px;
  writing-mode: horizontal-tb;
  box-sizing: border-box;
  color: rgb(32, 129, 226);
  text-decoration: none;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: inherit;
  pointer-events: initial;
`;

export const CardArticle = styled.article`
  line-height: 1.5;
  font-size: 15px;
  color: rgb(53, 56, 64);
  writing-mode: horizontal-tb;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  position: relative;
  z-index: 2;
  overflow: hidden;
  background-color: rgb(255, 255, 255);
  box-shadow: rgba(0, 0, 0, 0.05) 0px 4px 15px;
  transition: box-shadow 0.25s ease-in-out 0s;
  width: 302px;
  cursor: pointer;
`;

export const CardTop = styled.div`
  line-height: 1.5;
  font-size: 15px;
  writing-mode: horizontal-tb;
  color: rgb(32, 129, 226);
  pointer-events: initial;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  height: 302px;
  width: 302px;
`;

export const CardBottom = styled.div`
  line-height: 1.5;
  font-size: 15px;
  writing-mode: horizontal-tb;
  color: rgb(32, 129, 226);
  pointer-events: initial;
  box-sizing: border-box;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  row-gap: 12px;
  width: 100%;
  #description {
    box-sizing: border-box;
    color: #04111d;
    font-size: 12px;
    font-weight: 600;
    line-height: 18px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
  }
  #price {
    align-items: flex-start;
    box-sizing: border-box;
    color: #ffffff;
    cursor: pointer;
    display: flex;
    flex: 1 0 0%;
    flex-direction: column;
    font-size: 15px;
    line-height: 22.5px;
    span {
      box-sizing: border-box;
      color: #353840;
      cursor: pointer;
      font-size: 12px;
      font-weight: 600;
      line-height: 18px;
    }
    #valueWrapper {
      -webkit-box-align: center;
      -webkit-box-pack: end;
      align-items: center;
      box-sizing: border-box;
      color: #353840;
      cursor: pointer;
      display: flex;

      font-size: 16px;
      font-weight: 600;
      justify-content: flex-end;
      line-height: 24px;
      max-width: 100%;
      width: fit-content;
      img {
        box-sizing: border-box;
        color: #353840;
        cursor: pointer;
        display: block;

        font-weight: 600;
        height: 16px;
        line-height: 24px;
        object-fit: contain;
        width: 16px;
      }

      #value {
        box-sizing: border-box;
        color: #353840;
        font-weight: 600;
        line-height: 24px;
        margin-left: 0.3em;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 100%;
      }
    }
  }
  #button {
    align-items: center;
    appearance: button;
    background-color: ${({ theme }) => theme?.colors?.light.primary};
    border: 2px solid ${({ theme }) => theme?.colors?.light.primary};
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    border-radius: 0px 0px 10px 10px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 10px 0px;
    box-sizing: border-box;
    height: 36px;
    justify-content: center;
    letter-spacing: 0.16px;
    line-height: 22px;
    margin: 0px;
    padding: 0px;
    transition: all 0.2s ease 0s;
    width: 100%;
    cursor: pointer;
    :disabled {
      opacity: 0.4;
    }
    :hover {
      background-color: ${({ theme }) => theme?.colors?.light.secondary};
      border-color: ${({ theme }) => theme?.colors?.light.secondary};
      color: #ffffff;
    }
    @media (hover: hover) {
      box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 10px;
      transition: all 0.2s ease 0s;
    }
  }
`;
