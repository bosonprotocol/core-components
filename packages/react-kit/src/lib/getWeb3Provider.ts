import { providers } from "ethers";

const getWeb3Provider = async (): Promise<providers.Web3Provider | null> => {
  if (!window.ethereum) {
    console.log("error connecting to wallet");
    return null;
  } else {
    const provider = new providers.Web3Provider(window.ethereum);

    await provider.send("eth_requestAccounts", []);
    return provider;
  }
};

export default getWeb3Provider;
