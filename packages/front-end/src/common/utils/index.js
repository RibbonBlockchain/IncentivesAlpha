import { config } from "../constants/config";
import { SUPPORTED_THEMES } from "../constants";
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
        error: `Unable to detect Web3 on the browser.`
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

export function getQueryParam(windowLocation, name) {
  var q = windowLocation.search.match(new RegExp("[?&]" + name + "=([^&#?]*)"));
  return q && q[1];
}

export function getAllQueryParams() {
  let params = {};
  params.theme = checkSupportedTheme(getQueryParam(window.location, "theme"));
  return params;
}

export function checkSupportedTheme(themeName) {
  if (themeName && themeName.toUpperCase() in SUPPORTED_THEMES) {
    return themeName.toUpperCase();
  }
  return null;
}

export function shortenAddress(address, digits = 4) {
  if (!isAddress(address)) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }
  return `${address.substring(0, digits + 2)}...${address.substring(
    42 - digits
  )}`;
}

export function shortenTransactionHash(hash, digits = 4) {
  return `${hash.substring(0, digits + 2)}...${hash.substring(66 - digits)}`;
}

export function isAddress(value) {
  try {
    return ethers.utils.getAddress(value.toLowerCase());
  } catch {
    return false;
  }
}

export function calculateGasMargin(value, margin) {
  const offset = value.mul(margin).div(ethers.utils.bigNumberify(10000));
  return value.add(offset);
}

export const remUnit = px => `${px / 16}rem`;

export const getWidth = value => {
  if (!value) return;

  let width = (value / 12) * 100;
  return `width: ${width}%;`;
};

export const getFlex = value => {
  if (!value) return;

  let flex = (value / 12) * 100;
  return `flex: 0 0 ${flex}%;`;
};

export function getBlockscoutLink(data, type) {
  const prefix = `https://blockscout.com/poa/sokol/`;

  switch (type) {
    case "transaction": {
      return `${prefix}/tx/${data}`;
    }
    case "address":
    default: {
      return `${prefix}/address/${data}`;
    }
  }
}

export function amountFormatter(
  amount,
  baseDecimals = 18,
  displayDecimals = 3,
  useLessThan = true
) {
  if (
    baseDecimals > 18 ||
    displayDecimals > 18 ||
    displayDecimals > baseDecimals
  ) {
    throw Error(
      `Invalid combination of baseDecimals '${baseDecimals}' and displayDecimals '${displayDecimals}.`
    );
  }

  // if balance is falsy, return undefined
  if (!amount) {
    return undefined;
  }
  // if amount is 0, return
  else if (amount.isZero()) {
    return "0";
  }
  // amount > 0
  else {
    // amount of 'wei' in 1 'ether'
    const baseAmount = ethers.utils
      .bigNumberify(10)
      .pow(ethers.utils.bigNumberify(baseDecimals));

    const minimumDisplayAmount = baseAmount.div(
      ethers.utils
        .bigNumberify(10)
        .pow(ethers.utils.bigNumberify(displayDecimals))
    );

    // if balance is less than the minimum display amount
    if (amount.lt(minimumDisplayAmount)) {
      return useLessThan
        ? `<${ethers.utils.formatUnits(minimumDisplayAmount, baseDecimals)}`
        : `${ethers.utils.formatUnits(amount, baseDecimals)}`;
    }
    // if the balance is greater than the minimum display amount
    else {
      const stringAmount = ethers.utils.formatUnits(amount, baseDecimals);

      // if there isn't a decimal portion
      if (!stringAmount.match(/\./)) {
        return stringAmount;
      }
      // if there is a decimal portion
      else {
        const [wholeComponent, decimalComponent] = stringAmount.split(".");
        const roundedDecimalComponent = ethers.utils
          .bigNumberify(decimalComponent.padEnd(baseDecimals, "0"))
          .toString()
          .padStart(baseDecimals, "0")
          .substring(0, displayDecimals);

        // decimals are too small to show
        if (roundedDecimalComponent === "0".repeat(displayDecimals)) {
          return wholeComponent;
        }
        // decimals are not too small to show
        else {
          return `${wholeComponent}.${roundedDecimalComponent
            .toString()
            .replace(/0*$/, "")}`;
        }
      }
    }
  }
}

export function formatTokenBalance(balance, decimal) {
  return !!(balance && Number.isInteger(decimal))
    ? ethers.utils.formatEther(balance)
    : 0;
}

export function formatToUsd(price) {
  return Number(price).toFixed(4);
  //   const format = { decimalSeparator: ".", groupSeparator: ",", groupSize: 3 };
  //   const usdPrice = formatFixed(price, {
  //     decimalPlaces: 2,
  //     dropTrailingZeros: false,
  //     format
  //   });
  //   return usdPrice;
}

export const formatCurrency = amount => {
  return new Intl.NumberFormat().format(amount);
};
