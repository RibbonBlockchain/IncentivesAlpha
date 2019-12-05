import Web3 from "web3";
import { convertUtf8ToHex } from "@walletconnect/utils";
import IRegistry from "../../common/services/blockchain/apps/registry";
import AuthAPI from "../../common/services/api/auth.api";
import { setItem, clear } from "../../common/utils/storage";
import { recoverPersonalSignature } from "../../common/utils";

export async function authenticateUser(provider) {
  const web3 = new Web3(provider);
  const accounts = await web3.eth.getAccounts();
  const address = accounts[0];
  window.web3 = web3;
  web3.eth.extend({
    methods: [
      {
        name: "chainId",
        call: "eth_chainId",
        outputFormatter: web3.utils.hexToNumber
      }
    ]
  });
  try {
    let nonce = `Signing into RibbonBlockchain Dapp`;
    // hash nonce
    const hexMsg = convertUtf8ToHex(nonce);
    try {
      // sign message
      const result = await web3.eth.personal.sign(hexMsg, address);
      //   verify signature
      const signer = recoverPersonalSignature(result, nonce);
      const verified = signer.toLowerCase() === address.toLowerCase();
      if (verified) {
        return await loginUser(result, address, provider);
      } else {
        return {
          error: `Address recovered do not match, original ${address} versus computed ${signer}`
        };
      }
    } catch (error) {
      return { error };
    }
  } catch (error) {
    return {
      error
    };
  }
}

const loginUser = async (signature, publicAddress) => {
  let contract = new IRegistry();
  let authAPI = new AuthAPI();
  try {
    let authWithAPI = await authAPI.authenticate({
      publicAddress,
      signature
    });
    if (authWithAPI.error) {
      return {
        error: authWithAPI.error,
        publicAddress
      };
    } else if (authWithAPI.token) {
      let loginType = await contract.getUserRole(publicAddress);
      if (loginType) {
        return {
          authWithAPI,
          publicAddress,
          loginType
        };
      } else {
        return {
          error: "Failed to retrieve user login role"
        };
      }
    } else {
      clear();
      return {
        error:
          "Looks like connection to server timed out. Please try again later"
      };
    }
  } catch (error) {
    return {
      error
    };
  }
};

export async function approveUser(user) {
  setItem("token", user.authWithAPI.token);
  setItem("address", user.publicAddress);
  setItem("loginType", user.loginType);
  setItem("web3", user.web3);
  //   todo replace this
  //   window.location.reload();
}
