import { ethers } from "ethers";
import React from "react";
import Button from "./button/button";

const ConnectWallet = () => {
  const connectToWallet = async () => {
    if (!window.ethereum) {
      console.log("error connecting to wallet");
      return;
    } else {
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      await provider.send("eth_requestAccounts", []);

      const signer = provider.getSigner();

      const walletAddress = await signer.getAddress();

      const balance = await signer.getBalance();
    }
  };

  return <Button onClick={connectToWallet}>Connect to Wallet</Button>;
};

export default ConnectWallet;
