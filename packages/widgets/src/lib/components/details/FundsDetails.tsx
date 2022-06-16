import { utils, BigNumberish } from "ethers";
import { Row, Entry, Label, Value, Money, Currency } from "./shared-styles";

interface Props {
  currencySymbol: string;
  currencyDecimals?: number;
  availableFundsInWei: BigNumberish;
  minRequiredFundsInWei: BigNumberish;
}

export function FundsDetails({
  currencySymbol,
  currencyDecimals = 18,
  availableFundsInWei,
  minRequiredFundsInWei
}: Props) {
  return (
    <Row>
      <Entry>
        <Label>Available Funds</Label>
        <Money>
          <Value
            title={utils.formatUnits(availableFundsInWei, currencyDecimals)}
          >
            {utils.formatUnits(availableFundsInWei, currencyDecimals)}
          </Value>
          <Currency>{currencySymbol}</Currency>
        </Money>
      </Entry>
      <Entry>
        <Label>Min. Required Funds</Label>
        <Money>
          <Value
            title={utils.formatUnits(minRequiredFundsInWei, currencyDecimals)}
          >
            {utils.formatUnits(minRequiredFundsInWei, currencyDecimals)}
          </Value>
          <Currency>{currencySymbol}</Currency>
        </Money>
      </Entry>
    </Row>
  );
}
