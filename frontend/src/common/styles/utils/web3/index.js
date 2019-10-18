import Web3 from "web3";

let getWeb3 = new Promise(async (resolve, reject) => {
  // Check for injected web3 (mist/metamask)
  let ethereum = window.ethereum;
  if (typeof ethereum !== "undefined") {
    await ethereum.enable();
    resolve(new Web3(ethereum.currentProvider));
  } else if (typeof window.web3 !== "undefined") {
    resolve(new Web3(window.web3.currentProvider));
  } else {
    reject(new Error("Unable to connect to Metamask"));
  }
});

export default getWeb3;
