import React from "react";
import getWeb3Provider from "../../lib/getWeb3Provider";
import Button from "./button";

const ConnectWallet = () => {
  return <Button onClick={getWeb3Provider}>Connect to Wallet</Button>;
};

export default ConnectWallet;
