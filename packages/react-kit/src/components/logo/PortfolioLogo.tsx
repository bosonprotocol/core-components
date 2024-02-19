import { ChainId, Currency } from "@uniswap/sdk-core";
import blankTokenUrl from "../../assets/svg/blank_token.svg";
import { ReactComponent as UnknownStatus } from "../../assets/svg/contract-interaction.svg";
import React from "react";
import styled from "styled-components";
import { MissingImageLogo } from "./AssetLogo";
import { useAssetLogoSource } from "./useAssetLogoSource";

const UnknownContract = styled(UnknownStatus)``;

const DoubleLogoContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2px;
  position: relative;
  top: 0;
  left: 0;
  img:nth-child(n) {
    width: 19px;
    height: 40px;
    object-fit: cover;
  }
  img:nth-child(1) {
    border-radius: 20px 0 0 20px;
    object-position: 0 0;
  }
  img:nth-child(2) {
    border-radius: 0 20px 20px 0;
    object-position: 100% 0;
  }
`;

const StyledLogoParentContainer = styled.div`
  position: relative;
  top: 0;
  left: 0;
`;

const CircleLogoImage = styled.img<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: 50%;
`;
interface DoubleLogoProps {
  logo1?: string;
  logo2?: string;
  size: string;
  onError1?: () => void;
  onError2?: () => void;
}

function DoubleLogo({
  logo1,
  onError1,
  logo2,
  onError2,
  size
}: DoubleLogoProps) {
  return (
    <DoubleLogoContainer>
      <CircleLogoImage
        size={size}
        src={logo1 ?? blankTokenUrl}
        onError={onError1}
      />
      <CircleLogoImage
        size={size}
        src={logo2 ?? blankTokenUrl}
        onError={onError2}
      />
    </DoubleLogoContainer>
  );
}

interface DoubleCurrencyLogoProps {
  chainId: ChainId;
  currencies: Array<Currency | undefined>;
  backupImages?: Array<string | undefined>;
  size: string;
}

function DoubleCurrencyLogo({
  chainId,
  currencies,
  backupImages,
  size
}: DoubleCurrencyLogoProps) {
  const [src, nextSrc] = useAssetLogoSource(
    currencies?.[0]?.wrapped.address,
    chainId,
    currencies?.[0]?.isNative,
    backupImages?.[0]
  );
  const [src2, nextSrc2] = useAssetLogoSource(
    currencies?.[1]?.wrapped.address,
    chainId,
    currencies?.[1]?.isNative,
    backupImages?.[1]
  );

  if (currencies.length === 1 && src) {
    return <CircleLogoImage size={size} src={src} onError={nextSrc} />;
  }
  if (currencies.length > 1) {
    return (
      <DoubleLogo
        logo1={src}
        onError1={nextSrc}
        logo2={src2}
        onError2={nextSrc2}
        size={size}
      />
    );
  }
  return (
    <MissingImageLogo size={size}>
      {currencies[0]?.symbol
        ?.toUpperCase()
        .replace("$", "")
        .replace(/\s+/g, "")
        .slice(0, 3)}
    </MissingImageLogo>
  );
}

interface PortfolioLogoProps {
  chainId: ChainId;
  currencies?: Array<Currency | undefined>;
  images?: Array<string | undefined>;
  size?: string;
  style?: React.CSSProperties;
}

/**
 * Renders an image by prioritizing a list of sources, and then eventually a fallback contract icon
 */
export function PortfolioLogo(props: PortfolioLogoProps) {
  return (
    <StyledLogoParentContainer>{getLogo(props)}</StyledLogoParentContainer>
  );
}

function getLogo({
  chainId,
  currencies,
  images,
  size = "40px"
}: PortfolioLogoProps) {
  if (currencies && currencies.length) {
    return (
      <DoubleCurrencyLogo
        chainId={chainId}
        currencies={currencies}
        backupImages={images}
        size={size}
      />
    );
  }
  if (images?.length === 1) {
    return <CircleLogoImage size={size} src={images[0] ?? blankTokenUrl} />;
  }
  if (images && images?.length >= 2) {
    return (
      <DoubleLogo
        logo1={images[0]}
        logo2={images[images.length - 1]}
        size={size}
      />
    );
  }
  return <UnknownContract width={size} height={size} />;
}
