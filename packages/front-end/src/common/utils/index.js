import { config } from "../constants/config";
import { ethers } from "ethers";
import { getItem } from "./storage";
export const formatAddress = address => {
  let pre = address.toLowerCase().slice(0, 12);
  let post = address.toLowerCase().slice(address.length - 4);

  return `${pre}...${post}`;
};

export const toHex = str => {
  let result = "";
  for (let i = 0; i < str.length; i++) {
    result += str.charCodeAt(i).toString(16);
  }
  return result;
};

export const fromHex = hex => {
  let string = "";
  for (let i = 0; i < hex.length; i += 2) {
    string += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }
  return string;
};

export const formatLink = link => {
  return (
    link
      .substr(5)
      .charAt(0)
      .toUpperCase() + link.substr(6).replace("-", " ")
  );
};

export const getNetworkDetails = async (provider, signer, contract) => {
  try {
    let networkAddress = getItem("address");
    let currentNetwork = await provider.getNetwork();
    if (currentNetwork.chainId === Number(config.DEFAULT_NETWORK)) {
      let currentBalance = await provider.getBalance(networkAddress);
      let loginType = await contract.getUserRole(networkAddress);
      if (typeof loginType === "number") {
        return {
          currentNetwork,
          networkAddress,
          currentBalance,
          loginType
        };
      } else {
        await window.ethereum.enable();
        networkAddress = await signer.getAddress();
        let currentBalance = await provider.getBalance(networkAddress);
        let loginType = await contract.getUserRole(networkAddress);
        if (typeof loginType === "number") {
          return {
            currentNetwork,
            networkAddress,
            currentBalance,
            loginType
          };
        }
      }
    } else {
      return {
        error: `Network error occured. Please make sure you are on ${await getNetworkName(
          Number(config.DEFAULT_NETWORK)
        )}`
      };
    }
  } catch (error) {
    console.log(error);
    return {
      error: `Network error occured. Please make sure you are on ${await getNetworkName(
        Number(config.DEFAULT_NETWORK)
      )}`
    };
  }
};

export const getNetworkName = async id => {
  switch (id) {
    case 1:
      return "Main Network";
    case 3:
      return "Ropsten Testnet";
    case 4:
      return "Rinkeby Testnet";
    case 42:
      return "Kovan Testnet";
    case 77:
      return "Sokol Testnet";
    default:
      return "Local Testnet";
  }
};